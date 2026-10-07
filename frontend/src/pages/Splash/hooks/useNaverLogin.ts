// frontend/src/pages/Splash/hooks/useNaverLogin.ts

import { getApps } from "firebase/app";
import { useState, useCallback, useEffect, useRef } from 'react';
import { getMessaging, getToken } from "firebase/messaging"; // 🚨 FCM: Firebase import 추가
import axios from 'axios'; // 🚨 FCM: axios import 추가

// 백엔드 로그인 응답 타입 정의
interface BackendLoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
        id: string; // 사용자 ID (백엔드 Long 타입에 대응, JS에서는 string으로 받음)
        nickname: string;
        email?: string;
        socialProvider?: string;
        socialId?: string;
    };
    redirectUrl?: string;
}

interface UseNaverLoginOptions {
    naverClientId: string;
    naverCallbackUrl: string;
    frontendOrigin: string; 
    backendBaseUrl: string;
}

// --------------------------------------------------------------------------------
// 💡 FCM 토큰 획득 및 전송 유틸리티 함수
// --------------------------------------------------------------------------------

/**
 * 획득한 FCM 토큰을 백엔드 서버로 전송하는 함수
 */

const handleFcmTokenUpdate = async (userId: string, backendBaseUrl: string) => {
    
    // 🚨 1단계: Firebase 앱 초기화 여부 확인 (핵심)
    if (getApps().length === 0) {
        console.error("FCM: Firebase 앱이 초기화되지 않아 토큰 획득을 건너뜁니다.");
        // 여기서 초기화를 강제하려면, 초기화 로직을 담은 파일을 임포트해야 합니다.
        // import '경로/to/firebase.ts'; 
        // 💡 하지만 이는 훅의 역할이 아니므로, 초기화는 앱의 진입점에서 진행해야 합니다.
        // 현재는 콘솔에서 에러 로그만 남기고 종료합니다.
        return; 
    }
    
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
        try {
            // 2단계: Firebase Messaging 인스턴스 획득 및 토큰 획득 (기존 로직)
            const messaging = getMessaging(); 
            
            const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY; 
            
            if (!VAPID_KEY) {
                console.error("FCM: VITE_FIREBASE_VAPID_KEY 환경 변수가 설정되지 않았습니다.");
                return;
            }

            const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
            
            if (currentToken) {
                console.log("FCM: 토큰 획득 성공:", currentToken);
                await sendFcmTokenToServer(currentToken, userId, backendBaseUrl);
            } else {
                console.warn('FCM: 알림 권한이 없거나 토큰을 얻을 수 없습니다.');
            }
        } catch (err) {
            // 🚨 오류 로깅을 개선하여, 왜 오류가 났는지 상세히 확인합니다.
            console.error('FCM: 토큰 획득 또는 전송 중 오류 발생:', err); 
            // ⚠️ 이 오류가 "app/no-app"이 아닌지 확인하여, 초기화가 여전히 문제인지 판단합니다.
        }
    }
};

const sendFcmTokenToServer = async (token: string, userId: string, backendBaseUrl: string) => {
    try {
        // 백엔드 DTO에 맞춰 userId를 Number로 변환하여 전송합니다.
        const response = await axios.post(`${backendBaseUrl}/api/notifications/token`, {
            userId: Number(userId), 
            fcmToken: token
        });
        console.log("✅ FCM 토큰 서버 전송 성공:", response.data);
    } catch (error) {
        console.error("❌ FCM 토큰 서버 전송 실패:", error);
    }
};


// --------------------------------------------------------------------------------
// 💡 useNaverLogin Hook 본체
// --------------------------------------------------------------------------------

const useNaverLogin = ({
    naverClientId,
    naverCallbackUrl,
    frontendOrigin,
    backendBaseUrl, // FCM 로직에 사용
}: UseNaverLoginOptions) => {
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<BackendLoginResponse['user'] | null>(null);

    const naverLoginPopupRef = useRef<Window | null>(null);
    const isProcessingCallbackRef = useRef(false);

    // Naver 로그인 팝업을 띄우는 함수 (로직 변경 없음)
    const startNaverLogin = useCallback(() => {
        // ... (기존 startNaverLogin 로직)
        console.count("startNaverLogin called (in useNaverLogin hook)"); 

        if (!naverClientId || !naverCallbackUrl) {
             setError("Naver 로그인 설정 (Client ID 또는 Callback URL)이 올바르지 않습니다.");
             return;
        }

        if (isLoggingIn) { 
             console.log("이미 네이버 로그인 진행 중이므로 startNaverLogin 중단.");
             return;
        }
        
        if (naverLoginPopupRef.current && !naverLoginPopupRef.current.closed) {
             naverLoginPopupRef.current.focus();
             console.log("기존 네이버 로그인 팝업이 열려있습니다. 포커스합니다.");
             return;
        }

        setIsLoggingIn(true);
        setError(null);
        setIsLoggedIn(false);
        setUserData(null); 

        const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${naverCallbackUrl}&state=${state}`;

        const popup = window.open(naverAuthUrl, 'naverLoginPopup', 'width=500,height=600');
        naverLoginPopupRef.current = popup; 

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
             console.error("팝업이 차단되었거나 열리지 않았습니다.");
             setError("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.");
             setIsLoggingIn(false);
             return;
        }
    }, [naverClientId, naverCallbackUrl, isLoggingIn]);

    // 팝업 창으로부터 메시지를 수신하는 핸들러 (FCM 로직 추가)
    const handleMessageFromPopupRef = useRef(async (event: MessageEvent) => {
        
        if (event.origin !== frontendOrigin) {
            console.warn('Naver 팝업에서 알 수 없는 출처의 메시지가 도착했습니다:', event.origin);
            return;
        }

        const { type, code, state, error: popupError } = event.data;

        if (type === 'NAVER_AUTH_CODE') {
            console.log('useNaverLogin 훅: NAVER_AUTH_CODE 메시지 수신됨.');
            
            if (isProcessingCallbackRef.current) {
                console.warn("useNaverLogin 훅: 이미 네이버 인증 코드를 처리 중이므로 중복 호출을 막습니다.");
                return;
            }
            isProcessingCallbackRef.current = true; 

            if (!code || !state) {
                setError('Naver 콜백 데이터가 불완전합니다.');
                setIsLoggingIn(false);
                isProcessingCallbackRef.current = false; 
                return;
            }

            try {
                // 1. 백엔드 인증 코드 전송 (기존 로직)
                const backendResponse = await fetch(`${backendBaseUrl}/api/auth/naver`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, state }),
                });

                if (!backendResponse.ok) {
                    const errorData = await backendResponse.json();
                    throw new Error(errorData.message || '백엔드 Naver 로그인 처리 실패');
                }

                const responseData: BackendLoginResponse = await backendResponse.json();
                console.log('🎉 백엔드 Naver 로그인 성공 응답:', responseData);

                if (responseData.success) {
                    
                    // 2. 사용자 정보 저장 및 FCM 토큰 전송 (수정된 로직)
                    if (responseData.user && responseData.user.id) {
                        setUserData(responseData.user);
                        localStorage.setItem('userId', responseData.user.id);

                        // 🚨 로그인 성공 및 ID 획득 직후 FCM 로직 호출
                        // 비동기로 실행되므로 await를 사용하여 FCM 전송이 완료된 후 페이지 이동을 보장합니다.
                        await handleFcmTokenUpdate(responseData.user.id, backendBaseUrl); 
                    }
                    
                    if (responseData.token) {
                        localStorage.setItem('userToken', responseData.token);
                    }
                    
                    setIsLoggedIn(true);
                    setError(null);

                    // 3. 페이지 이동 (FCM 전송 후 실행)
                    if (responseData.redirectUrl) {
                        window.location.href = responseData.redirectUrl; 
                    } else {
                        window.location.href = '/main'; 
                    }
                } else {
                    setError(responseData.message || '백엔드에서 로그인 처리 실패');
                    setIsLoggedIn(false);
                    window.location.href = '/splash'; 
                }

            } catch (backendError: any) {
                console.error('👎 백엔드 Naver 로그인 처리 중 오류:', backendError);
                setError(backendError.message || 'Naver 로그인 백엔드 처리 오류');
                setIsLoggedIn(false);
                window.location.href = '/splash';
            } finally {
                setIsLoggingIn(false);
                isProcessingCallbackRef.current = false; 
                if (naverLoginPopupRef.current) {
                    naverLoginPopupRef.current.close();
                    naverLoginPopupRef.current = null;
                }
            }
        } 
        // ... (기존 NAVER_LOGIN_FAILURE_FROM_POPUP 처리)
    });


    useEffect(() => {
        // ... (기존 window.addEventListener 및 클린업 로직)
        const currentHandleMessage = handleMessageFromPopupRef.current;
        window.addEventListener('message', currentHandleMessage);
        console.log("useNaverLogin 훅: 메시지 리스너 등록됨.");

        return () => {
            window.removeEventListener('message', currentHandleMessage);
            console.log("useNaverLogin 훅: 메시지 리스너 해제됨.");
            if (naverLoginPopupRef.current && !naverLoginPopupRef.current.closed) {
                naverLoginPopupRef.current.close();
                naverLoginPopupRef.current = null;
                console.log("useNaverLogin 훅: 언마운트 시 열려있던 팝업 닫힘.");
            }
        };
    }, [frontendOrigin, backendBaseUrl]); 

    return {
        startNaverLogin,
        isLoggingIn,
        isLoggedIn,
        error,
        userData,
    };
};

export default useNaverLogin;