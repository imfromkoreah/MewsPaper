// frontend/src/pages/Splash/hooks/useGoogleLogin.ts

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  googleClientId: string;   // Google Cloud Console에서 발급받은 클라이언트 ID
  googleAuthUrl: string;    // Google OAuth 인증 엔드포인트 (일반적으로 'https://accounts.google.com/o/oauth2/v2/auth')
  googleScope: string;      // 요청할 Google API 스코프 (예: 'email profile openid')
  frontendOrigin: string;   // 프론트엔드 애플리케이션의 Origin (예: 'http://localhost:5173')
  backendBaseUrl: string;   // 백엔드 API의 기본 URL (예: 'http://localhost:8080')
}

const useGoogleLogin = ({
  googleClientId,
  googleAuthUrl,
  googleScope,
  frontendOrigin,
  backendBaseUrl,
}: UseGoogleLoginOptions) => {
  const navigate = useNavigate(); // React Router의 navigate 훅
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 로그인 진행 중 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);   // 로그인 성공 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [userData, setUserData] = useState<BackendLoginResponse['user'] | null>(null); // 사용자 데이터

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

    // CSRF 방지를 위한 state 값 생성 (백엔드에서 검증할 수도 있음)
    // Google은 이 state 값을 콜백 URI에 그대로 반환합니다.
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Google OAuth 인증 URL 생성
    // redirect_uri는 프론트엔드의 콜백 URL이어야 합니다.
    // 이 페이지는 팝업 창에서 열리고, 인증 코드와 state를 부모 창으로 postMessage할 것입니다.
    const googleLoginUrl = `${googleAuthUrl}?client_id=${googleClientId}` +
                           `&redirect_uri=${frontendOrigin}/google/callback` + // 이 URL은 App.tsx에서 <Route path="/google/callback" />으로 처리되어야 함
                           `&response_type=code` +
                           `&scope=${googleScope}` +
                           `&state=${state}` +
                           `&access_type=offline` + // refresh token이 필요한 경우 (최초 로그인 시에만 필요)
                           `&prompt=consent`;       // 사용자에게 동의 화면을 항상 표시 (refresh token 획득에 도움)

    console.log("최종 생성된 Google Login URL (수정 후):", googleLoginUrl);

    // 새 창으로 로그인 페이지 띄우기 (팝업 차단될 수 있으므로, 사용자 제스처(클릭) 내에서 호출되어야 함)
    // '_blank' 대신 고유한 팝업 이름을 사용하면 기존 팝업을 재활용할 수 있습니다.
    window.open(googleLoginUrl, 'GoogleLoginPopup', 'width=500,height=600,toolbar=no,menubar=no,status=no,location=no');

  }, [googleClientId, googleAuthUrl, googleScope, frontendOrigin]);

  // 팝업 창으로부터 메시지를 수신하는 핸들러
  const handleMessageFromPopup = useCallback(async (event: MessageEvent) => {
    // 보안: 메시지의 출처(origin)를 반드시 확인하여 알 수 없는 출처의 메시지를 거부합니다.
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
        // 백엔드로 인증 코드와 state를 전송하여 최종 로그인 처리 요청
        // 백엔드는 이 코드를 사용하여 Google의 Access Token을 얻고 사용자 정보를 가져옵니다.
        const backendResponse = await fetch(`${backendBaseUrl}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
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
            // 필요하다면 사용자 ID나 토큰을 로컬 스토리지 등에 저장
            if (responseData.user.id) {
              localStorage.setItem('userId', responseData.user.id);
            }
            if (responseData.token) {
                localStorage.setItem('authToken', responseData.token); // JWT 토큰 저장
            }
          }
          setIsLoggedIn(true);

          // 백엔드에서 받은 리다이렉트 URL로 이동
          if (responseData.redirectUrl) {
            console.log(`➡️ ${responseData.redirectUrl} 로 리다이렉트합니다.`);
            // React Router의 navigate는 내부 경로에 적합하고,
            // 백엔드에서 절대 경로를 주는 경우 window.location.href를 사용해야 정확합니다.
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
  }, [backendBaseUrl, frontendOrigin, navigate]);

  // 컴포넌트 마운트 시 메시지 리스너 등록, 언마운트 시 해제
  useEffect(() => {
    window.addEventListener('message', handleMessageFromPopup);

    return () => {
      window.removeEventListener('message', handleMessageFromPopup);
    };
  }, [handleMessageFromPopup]); // handleMessageFromPopup 함수가 변경될 때만 리스너 재등록

  return {
    startGoogleLogin,
    isLoggingIn,
    isLoggedIn,
    error,
    userData,
  };
};

export default useGoogleLogin;