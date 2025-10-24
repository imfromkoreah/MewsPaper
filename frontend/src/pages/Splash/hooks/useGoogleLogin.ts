// frontend/src/pages/Splash/hooks/useGoogleLogin.ts

import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';
import { getMessaging, getToken } from "firebase/messaging"; // 🚨 FCM: Firebase import 추가
import { useNavigate } from 'react-router-dom';
import { getApps } from 'firebase/app';

// 백엔드 로그인 응답 타입 정의 (필요에 따라 더 상세하게 정의 가능)
interface BackendLoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
        id: string; // 우리 서비스의 사용자 ID
        nickname: string;
        email?: string;
        socialProvider?: string; // 예: "GOOGLE", "KAKAO", "NAVER"
        socialId?: string;       // 소셜 서비스의 고유 ID (예: Google의 'sub' 값)
    };
    redirectUrl?: string; // 백엔드에서 결정된 리다이렉트 URL (예: /onboarding, /home)
}

// useGoogleLogin 훅의 옵션 인터페이스
interface UseGoogleLoginOptions {
    googleClientId: string;    // Google Cloud Console에서 발급받은 클라이언트 ID
    googleAuthUrl: string;     // Google OAuth 인증 엔드포인트
    googleScope: string;       // 요청할 Google API 스코프
    frontendOrigin: string;    // 프론트엔드 애플리케이션의 Origin
    backendBaseUrl: string;    // 백엔드 API의 기본 URL
}

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

const useGoogleLogin = ({
    googleClientId,
    googleAuthUrl,
    googleScope,
    frontendOrigin,
    backendBaseUrl,
}: UseGoogleLoginOptions) => {
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<BackendLoginResponse['user'] | null>(null);

    // Google 로그인 팝업을 띄우는 함수
    const startGoogleLogin = useCallback(() => {
        // 필수 환경 변수들이 설정되었는지 확인
        if (!googleClientId || !googleAuthUrl || !googleScope || !frontendOrigin) {
            setError("Google 로그인 설정 (Client ID, Auth URL, Scope, Frontend Origin)이 올바르지 않습니다. .env 파일을 확인해주세요.");
            return;
        }

        setIsLoggingIn(true);
        setError(null);
        setIsLoggedIn(false);

        // CSRF 방지를 위한 state 값 생성
        const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Google OAuth 인증 URL 생성
        const googleLoginUrl = `${googleAuthUrl}?client_id=${googleClientId}` +
                                `&redirect_uri=${frontendOrigin}/google/callback` +
                                `&response_type=code` +
                                `&scope=${googleScope}` +
                                `&state=${state}` +
                                `&access_type=offline` +
                                `&prompt=consent`;

        console.log("최종 생성된 Google Login URL:", googleLoginUrl);

        // 새 창으로 로그인 페이지 띄우기
        window.open(googleLoginUrl, 'GoogleLoginPopup', 'width=500,height=600,toolbar=no,menubar=no,status=no,location=no');

    }, [googleClientId, googleAuthUrl, googleScope, frontendOrigin]);

    // 팝업 창으로부터 메시지를 수신하는 핸들러
    const handleMessageFromPopup = useCallback(async (event: MessageEvent) => {
        // 보안: 메시지의 출처(origin) 확인
        if (event.origin !== frontendOrigin) {
            console.warn('Google 팝업에서 알 수 없는 출처의 메시지가 도착했습니다:', event.origin);
            return;
        }

        const { type, code, state, error: popupError } = event.data;

        // Google 인증 코드를 성공적으로 수신했을 때
        if (type === 'GOOGLE_AUTH_CODE') {
            if (!code || !state) {
                setError('Google 콜백 데이터가 불완전합니다 (code 또는 state 누락).');
                setIsLoggingIn(false);
                return;
            }

            console.log('Google 인증 코드 수신 (프론트엔드):', code);

            try {
                // 2. 백엔드로 인증 코드, state, 그리고 FCM 토큰을 함께 전송
                const backendResponse = await fetch(`${backendBaseUrl}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        code, 
                        state
                    }),
                });

                if (!backendResponse.ok) {
                    const errorData = await backendResponse.json();
                    throw new Error(errorData.message || `백엔드 Google 로그인 처리 실패: ${backendResponse.statusText}`);
                }

                const responseData: BackendLoginResponse = await backendResponse.json();
                console.log('🎉 백엔드 Google 로그인 성공 응답:', responseData);

                if (responseData.success) {
                    // 사용자 데이터 저장
                    if (responseData.user) {
                        setUserData(responseData.user);
                        if (responseData.user.id) {
                            localStorage.setItem('userId', responseData.user.id);
                            await handleFcmTokenUpdate(responseData.user.id, backendBaseUrl); 

                        }
                        if (responseData.token) {
                            localStorage.setItem('userToken', responseData.token); // JWT 토큰 저장
                        }
                    }
                    setIsLoggedIn(true);


                    // 백엔드에서 받은 리다이렉트 URL로 이동
                    if (responseData.redirectUrl) {
                        console.log(`➡️ ${responseData.redirectUrl} 로 리다이렉트합니다.`);
                        window.location.href = responseData.redirectUrl; // 전체 페이지 리로드
                    } else {
                        console.warn('백엔드에서 redirectUrl을 받지 못했습니다. 기본 페이지로 이동합니다.');
                        navigate('/main'); // 기본 경로로 이동 (예시)
                    }
                } else {
                    setError(responseData.message || 'Google 로그인 실패: 백엔드 응답 오류');
                    setIsLoggedIn(false);
                }

            } catch (backendError: any) {
                console.error('👎 백엔드 Google 로그인 처리 중 오류:', backendError);
                setError(backendError.message || 'Google 로그인 백엔드 처리 오류 발생');
                setIsLoggedIn(false);
            } finally {
                setIsLoggingIn(false); // 로그인 시도 종료
            }
        } else if (type === 'GOOGLE_LOGIN_FAILURE_FROM_POPUP') {
            // 팝업에서 발생한 오류 처리
            console.error('👎 Google 로그인 팝업에서 오류 발생:', popupError);
            setError(popupError || 'Google 로그인 팝업 처리 실패');
            setIsLoggingIn(false);
        }
    }, [backendBaseUrl, frontendOrigin, navigate]); // 💡 getFcmToken 의존성 추가

    // 컴포넌트 마운트 시 메시지 리스너 등록, 언마운트 시 해제
    useEffect(() => {
        window.addEventListener('message', handleMessageFromPopup);

        return () => {
            window.removeEventListener('message', handleMessageFromPopup);
        };
    }, [handleMessageFromPopup]);

    return {
        startGoogleLogin,
        isLoggingIn,
        isLoggedIn,
        error,
        userData,
    };
};

export default useGoogleLogin;