// frontend/src/pages/Splash/hooks/useKakaoLogin.ts

import { useState, useCallback, useEffect } from 'react';

// === 카카오 SDK 타입 선언 (이전과 동일) ===
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: KakaoAuthResponse) => void;
          fail: (error: KakaoAuthError) => void;
          scope?: string;
          throughTalk?: boolean;
          persistAccessToken?: boolean;
          serviceTerms?: string;
          agreements?: string;
          channelPublicIds?: string[];
        }) => void;
        logout: (callback: () => void) => void;
        getAccessToken: () => string | undefined;
        setAccessToken: (token: string) => void;
      };
      // ... 필요한 다른 Kakao 객체의 속성들 (API, Channel 등)
    };
  }
}

// === 타입 정의 (이전과 동일) ===
interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface KakaoAuthError {
  error: string;
  error_description: string;
}

// BackendLoginResponse 인터페이스 수정: redirectUrl 필드 추가
interface BackendLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string; // 백엔드 User 엔티티의 ID 타입에 따라 string 또는 number (Long)로 설정
    nickname: string;
    // user DTO에 email, socialProvider, socialId가 추가되었다면 여기에 추가
    email?: string;
    socialProvider?: string;
    socialId?: string;
  };
  redirectUrl?: string; // <-- 이 필드를 추가합니다.
}

// === useKakaoLogin 커스텀 훅 정의 ===
const useKakaoLogin = (kakaoAppKey: string) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<BackendLoginResponse['user'] | null>(null);

  const BACKEND_BASE_URL = 'http://localhost:8080';

  // 🚨 이 useEffect 훅이 컴포넌트가 마운트될 때 카카오 SDK를 초기화합니다.
  useEffect(() => {
    const checkKakaoSdk = setInterval(() => {
      if (window.Kakao) {
        clearInterval(checkKakaoSdk); // SDK 로드 확인되면 폴링 중지
        if (!window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(kakaoAppKey);
            console.log('✅ 카카오 SDK 초기화 완료');
            // 초기화 후, 제대로 초기화되었는지 한 번 더 검증
            if (!window.Kakao.isInitialized()) {
                console.error('❌ 카카오 SDK 초기화는 되었으나, isInitialized()가 false를 반환합니다. 앱 키를 다시 확인해주세요.');
                setError('카카오 앱 키가 유효하지 않습니다.');
            }
          } catch (e: any) {
            console.error('❌ 카카오 SDK 초기화 중 치명적인 오류 발생:', e);
            setError(`카카오 SDK 초기화 실패: ${e.message || e}`);
          }
        } else {
          console.log('✅ 카카오 SDK 이미 초기화됨');
        }
      } else {
        console.log('⏳ 카카오 SDK 로드 대기 중...');
      }
    }, 200);

    // 컴포넌트 언마운트 시 폴링 정리
    return () => clearInterval(checkKakaoSdk);

  }, [kakaoAppKey]); // kakaoAppKey가 변경될 때만 다시 실행

  // 실제 카카오 로그인 프로세스를 시작하는 함수 (이전과 동일)
  const startKakaoLogin = useCallback(() => {
    console.log("👉 카카오 로그인 버튼 클릭됨");
    if (!window.Kakao) {
      setError("❌ 카카오 SDK가 로드되지 않았습니다.");
      console.error("❌ startKakaoLogin: window.Kakao 객체가 없습니다.");
      return;
    }
    if (!window.Kakao.isInitialized()) {
      setError("❌ 카카오 SDK가 초기화되지 않았습니다.");
      console.error("❌ startKakaoLogin: 카카오 SDK가 초기화되지 않았습니다. 앱 키나 init 호출 확인.");
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    setIsLoggedIn(false);

    window.Kakao.Auth.login({
      success: async (authObj: KakaoAuthResponse) => {
        console.log('👍 카카오 SDK 로그인 성공 (프론트엔드):', authObj);
        try {
          const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/auth/kakao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: authObj.access_token }),
          });

          if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            throw new Error(errorData.message || '백엔드 로그인 처리 실패');
          }

          const responseData: BackendLoginResponse = await backendResponse.json();
          console.log('🎉 백엔드 로그인 성공 (서버로부터 응답):', responseData);
          
          if (responseData.token) {
            localStorage.setItem('userToken', responseData.token);  // ← 여기에 토큰 저장 추가
          }
          
          if (responseData.user){
            localStorage.setItem('userId', responseData.user.id);
          }

          setIsLoggedIn(true);

          // 백엔드에서 받은 redirectUrl로 이동하는 로직 추가
          if (responseData.redirectUrl) {
            console.log(`➡️ ${responseData.redirectUrl} 로 리다이렉트합니다.`);
            window.location.href = responseData.redirectUrl;
          } else {
            // redirectUrl이 없으면 기본적으로 /home 또는 다른 페이지로 이동
            console.warn('백엔드에서 redirectUrl을 받지 못했습니다. 기본 페이지로 이동합니다.');
            window.location.href = 'http://localhost:5173/home'; // 기본값 설정
          }

        } catch (backendError: any) {
          console.error('👎 백엔드 로그인 처리 중 오류:', backendError);
          setError(backendError.message || '백엔드 처리 오류 발생');
          setIsLoggedIn(false);
        } finally {
          setIsLoggingIn(false);
        }
      },
      fail: (err: KakaoAuthError) => {
        console.error('👎 카카오 SDK 로그인 실패:', err);
        setError(err.error_description || '카카오 로그인 실패');
        setIsLoggingIn(false);
        setIsLoggedIn(false);
      },
    });
  }, [kakaoAppKey]);

  // 로그아웃 함수 (이전과 동일)
  const logoutKakao = useCallback(() => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.logout(() => {
        console.log('카카오 로그아웃 완료');
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setUserData(null);
        setError(null);
      });
    }
  }, []);

  return {
    startKakaoLogin,
    logoutKakao,
    isLoggingIn,
    isLoggedIn,
    error,
    userData,
  };
};

export default useKakaoLogin;