// frontend/src/pages/Splash/hooks/useNaverLogin.ts

import { useState, useCallback, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom'; // useNavigate는 더 이상 직접 사용하지 않으므로 주석 처리 또는 제거

// 백엔드 로그인 응답 타입 정의 (useKakaoLogin.ts와 동일하게 사용 가능)
interface BackendLoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
        id: string;
        nickname: string;
        email?: string;
        socialProvider?: string;
        socialId?: string;
    };
    redirectUrl?: string; // 백엔드에서 온보딩 필요 여부에 따라 리다이렉트 URL을 보낼 것으로 예상
}

interface UseNaverLoginOptions {
    naverClientId: string;
    naverCallbackUrl: string;
    frontendOrigin: string; // 부모 창의 Origin (보안상 필요)
    backendBaseUrl: string; // 백엔드 API 기본 URL
}

const useNaverLogin = ({
    naverClientId,
    naverCallbackUrl,
    frontendOrigin,
    backendBaseUrl,
}: UseNaverLoginOptions) => {
    // const navigate = useNavigate(); // useNavigate는 더 이상 직접 사용하지 않으므로 주석 처리 또는 제거
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<BackendLoginResponse['user'] | null>(null);

    // 팝업 창 참조를 위한 useRef
    const naverLoginPopupRef = useRef<Window | null>(null);
    // 메시지 처리 중복 방지를 위한 플래그
    const isProcessingCallbackRef = useRef(false);

    // Naver 로그인 팝업을 띄우는 함수
    const startNaverLogin = useCallback(() => {
        // 이 함수가 호출되는 횟수를 확인합니다.
        console.count("startNaverLogin called (in useNaverLogin hook)"); 

        if (!naverClientId || !naverCallbackUrl) {
            setError("Naver 로그인 설정 (Client ID 또는 Callback URL)이 올바르지 않습니다.");
            return;
        }

        // 이미 로그인 진행 중이라면 중복 호출 방지
        if (isLoggingIn) { 
            console.log("이미 네이버 로그인 진행 중이므로 startNaverLogin 중단.");
            return;
        }
        
        // 이미 열린 팝업이 있다면 새로 열지 않고 포커스
        if (naverLoginPopupRef.current && !naverLoginPopupRef.current.closed) {
            naverLoginPopupRef.current.focus();
            console.log("기존 네이버 로그인 팝업이 열려있습니다. 포커스합니다.");
            return;
        }

        setIsLoggingIn(true);
        setError(null);
        setIsLoggedIn(false);
        setUserData(null); // 새로운 로그인 시도 시 userData 초기화

        // CSRF 방지를 위한 state 값 생성 (백엔드에서 검증 필요)
        const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${naverCallbackUrl}&state=${state}`;

        // 새 창으로 로그인 페이지 띄우기
        const popup = window.open(naverAuthUrl, 'naverLoginPopup', 'width=500,height=600');
        naverLoginPopupRef.current = popup; // 팝업 참조 저장

        // 팝업 차단 여부 확인
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            console.error("팝업이 차단되었거나 열리지 않았습니다.");
            setError("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.");
            setIsLoggingIn(false);
            return;
        }
    }, [naverClientId, naverCallbackUrl, isLoggingIn]); // isLoggingIn도 의존성에 추가하여 중복 호출 방지

    // 팝업 창으로부터 메시지를 수신하는 핸들러 (useRef로 감싸서 참조 고정)
    // handleMessageFromPopup 함수 자체를 useRef에 저장하여 불필요한 재생성을 막습니다.
    const handleMessageFromPopupRef = useRef(async (event: MessageEvent) => {
        // 메시지의 출처(origin)를 반드시 확인하여 보안 위험을 줄입니다.
        if (event.origin !== frontendOrigin) {
            console.warn('Naver 팝업에서 알 수 없는 출처의 메시지가 도착했습니다:', event.origin);
            return;
        }

        const { type, code, state, error: popupError } = event.data;

        if (type === 'NAVER_AUTH_CODE') {
            console.log('useNaverLogin 훅: NAVER_AUTH_CODE 메시지 수신됨.');
            // 중요: 메시지 처리 중복 방지 플래그 확인
            if (isProcessingCallbackRef.current) {
                console.warn("useNaverLogin 훅: 이미 네이버 인증 코드를 처리 중이므로 중복 호출을 막습니다.");
                return;
            }
            isProcessingCallbackRef.current = true; // 처리 시작 플래그 설정

            if (!code || !state) {
                setError('Naver 콜백 데이터가 불완전합니다.');
                setIsLoggingIn(false);
                isProcessingCallbackRef.current = false; // 처리 완료 (실패)
                return;
            }

            console.log('Naver 인증 코드 수신 (프론트엔드):', code ? code.substring(0, 10) + '...' : '없음');

            try {
                // 백엔드로 인증 코드와 state 전송하여 최종 로그인 처리 요청
                // 이 API는 `code`와 `state`를 POST body로 보냅니다.
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
                    if (responseData.user) {
                        setUserData(responseData.user);
                        if (responseData.user.id) {
                            localStorage.setItem('userId', responseData.user.id);
                        }
                    }
                    if (responseData.token) {
                        localStorage.setItem('authToken', responseData.token); // JWT 토큰 저장
                    }
                    setIsLoggedIn(true);
                    setError(null);

                    // 백엔드에서 받은 리다이렉트 URL로 이동
                    if (responseData.redirectUrl) {
                        console.log(`➡️ ${responseData.redirectUrl} 로 리다이렉트합니다.`);
                        // ⭐⭐⭐ 요청하신 대로 window.location.href로 수정 ⭐⭐⭐
                        window.location.href = responseData.redirectUrl; 
                    } else {
                        console.warn('백엔드에서 redirectUrl을 받지 못했습니다. 기본 페이지로 이동합니다.');
                        // window.location.href 사용 시, SPA 내 라우팅이 아닌 전체 페이지 새로고침
                        window.location.href = '/main'; // 기본 경로로 이동 (예시)
                    }
                } else {
                    setError(responseData.message || '백엔드에서 로그인 처리 실패');
                    setIsLoggedIn(false);
                    // 실패 시에도 전체 페이지 새로고침을 원한다면
                    window.location.href = '/splash'; // 실패 시 스플래시로 이동 (전체 새로고침)
                }

            } catch (backendError: any) {
                console.error('👎 백엔드 Naver 로그인 처리 중 오류:', backendError);
                setError(backendError.message || 'Naver 로그인 백엔드 처리 오류');
                setIsLoggedIn(false);
                // 오류 시에도 전체 페이지 새로고침을 원한다면
                window.location.href = '/splash'; // 오류 시 스플래시로 이동 (전체 새로고침)
            } finally {
                setIsLoggingIn(false);
                isProcessingCallbackRef.current = false; // 처리 완료
                // 팝업 창 닫기 (NaverCallback.tsx에서도 닫지만, 확실히 하기 위해)
                if (naverLoginPopupRef.current) {
                    naverLoginPopupRef.current.close();
                    naverLoginPopupRef.current = null; // 참조 초기화
                }
            }
        } else if (type === 'NAVER_LOGIN_FAILURE_FROM_POPUP') {
            console.error('👎 Naver 로그인 팝업에서 오류 발생:', popupError);
            setError(popupError || 'Naver 로그인 팝업 처리 실패');
            setIsLoggingIn(false);
            isProcessingCallbackRef.current = false; // 처리 완료
            if (naverLoginPopupRef.current) {
                naverLoginPopupRef.current.close();
                naverLoginPopupRef.current = null; // 참조 초기화
            }
            // 팝업 실패 시에도 전체 페이지 새로고침을 원한다면
            window.location.href = '/splash'; 
        }
    });


    useEffect(() => {
        // useRef에 저장된 함수를 리스너로 등록
        const currentHandleMessage = handleMessageFromPopupRef.current;
        window.addEventListener('message', currentHandleMessage);
        console.log("useNaverLogin 훅: 메시지 리스너 등록됨.");

        // 클린업 함수에서 정확한 참조를 사용하여 리스너 해제
        return () => {
            window.removeEventListener('message', currentHandleMessage);
            console.log("useNaverLogin 훅: 메시지 리스너 해제됨.");
            // 컴포넌트 언마운트 시 열려있는 팝업이 있다면 닫기
            if (naverLoginPopupRef.current && !naverLoginPopupRef.current.closed) {
                naverLoginPopupRef.current.close();
                naverLoginPopupRef.current = null;
                console.log("useNaverLogin 훅: 언마운트 시 열려있던 팝업 닫힘.");
            }
        };
    }, [frontendOrigin, backendBaseUrl]); // navigate를 사용하지 않으므로 의존성 배열에서 제거

    return {
        startNaverLogin,
        isLoggingIn,
        isLoggedIn,
        error,
        userData,
    };
};

export default useNaverLogin;