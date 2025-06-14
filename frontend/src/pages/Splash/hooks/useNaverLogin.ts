// frontend/src/pages/Splash/hooks/useNaverLogin.ts (현재 당신의 코드)

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  redirectUrl?: string;
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
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<BackendLoginResponse['user'] | null>(null);

  // Naver 로그인 팝업을 띄우는 함수
  const startNaverLogin = useCallback(() => {
    if (!naverClientId || !naverCallbackUrl) {
      setError("Naver 로그인 설정 (Client ID 또는 Callback URL)이 올바르지 않습니다.");
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    setIsLoggedIn(false);

    // CSRF 방지를 위한 state 값 생성 (백엔드에서 검증 필요)
    const state = Math.random().toString(36).substring(2, 15);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${naverCallbackUrl}&state=${state}`;

    // 새 창으로 로그인 페이지 띄우기
    window.open(naverAuthUrl, '_blank', 'width=500,height=600');
  }, [naverClientId, naverCallbackUrl]);

  // 팝업 창으로부터 메시지를 수신하는 핸들러
  const handleMessageFromPopup = useCallback(async (event: MessageEvent) => {
    // 메시지의 출처(origin)를 반드시 확인하여 보안 위험을 줄입니다.
    if (event.origin !== frontendOrigin) {
      console.warn('Naver 팝업에서 알 수 없는 출처의 메시지가 도착했습니다:', event.origin);
      return;
    }

    const { type, code, state, error: popupError } = event.data;

    if (type === 'NAVER_AUTH_CODE') {
      if (!code || !state) {
        setError('Naver 콜백 데이터가 불완전합니다.');
        setIsLoggingIn(false);
        return;
      }

      console.log('Naver 인증 코드 수신 (프론트엔드):', code);

      try {
        // 백엔드로 인증 코드와 state 전송하여 최종 로그인 처리 요청
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
        console.log('🎉 백엔드 Naver 로그인 성공:', responseData);

        if (responseData.user) {
          setUserData(responseData.user);
          if (responseData.user.id) {
            localStorage.setItem('userId', responseData.user.id); // 사용자 ID 저장 (필요시)
          }
        }
        setIsLoggedIn(true);

        // 백엔드에서 받은 리다이렉트 URL로 이동
        if (responseData.redirectUrl) {
          console.log(`➡️ ${responseData.redirectUrl} 로 리다이렉트합니다.`);
          window.location.href = responseData.redirectUrl; // ⬅️ 이 라인으로 변경
        } else {
          console.warn('백엔드에서 redirectUrl을 받지 못했습니다. 기본 페이지로 이동합니다.');
          navigate('/main'); // 기본 경로로 이동 (예시)
        }

      } catch (backendError: any) {
        console.error('👎 백엔드 Naver 로그인 처리 중 오류:', backendError);
        setError(backendError.message || 'Naver 로그인 백엔드 처리 오류');
        setIsLoggedIn(false);
      } finally {
        setIsLoggingIn(false);
      }
    } else if (type === 'NAVER_LOGIN_FAILURE_FROM_POPUP') {
      console.error('👎 Naver 로그인 팝업에서 오류 발생:', popupError);
      setError(popupError || 'Naver 로그인 팝업 처리 실패');
      setIsLoggingIn(false);
    }
  }, [backendBaseUrl, frontendOrigin, navigate]);

  useEffect(() => {
    // 컴포넌트 마운트 시 메시지 리스너 등록
    window.addEventListener('message', handleMessageFromPopup);

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      window.removeEventListener('message', handleMessageFromPopup);
    };
  }, [handleMessageFromPopup]); // handleMessageFromPopup이 변경될 때만 재등록

  return {
    startNaverLogin,
    isLoggingIn,
    isLoggedIn,
    error,
    userData,
  };
};

export default useNaverLogin;