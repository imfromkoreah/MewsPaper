/* eslint-disable no-irregular-whitespace */
// frontend/src/pages/Splash/hooks/useKakaoLogin.ts

import { useState, useCallback, useEffect } from 'react';
// 💡💡💡 Firebase SDK import 💡💡💡
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import axios from 'axios';


// ⚠️⚠️⚠️ 1. Firebase 구성 정보와 VAPID 키를 실제 값으로 반드시 교체하세요! ⚠️⚠️⚠️
// 이 정보는 환경 변수(.env)로 관리하는 것을 강력히 권장합니다.
const firebaseConfig = {
    apiKey: "AIzaSyBTByoDvilj4-zvYbVFt82dEIb3DN2TYwY",
    authDomain: "mewspaper-baaf4.firebaseapp.com",
    projectId: "mewspaper-baaf4",
    storageBucket: "mewspaper-baaf4.firebasestorage.app",
    messagingSenderId: "702836300187",
    appId: "1:702836300187:web:f501bb88c416ab589c693e",
};

// VAPID 키 (Firebase 콘솔 > 프로젝트 설정 > 클라우드 메시징 > 웹 구성)
const VAPID_KEY = "BOW9qpDO5RbOsvoriO6bhJz1yVJr3V2PBrLbpka_ypFxwmxCgbFuHFkZf0mlp880ri0Izh8s6_ETLV4FMx-SKwU";

// Firebase 앱 및 Messaging 인스턴스를 파일 전역에서 관리
let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

try {
    // 앱 초기화는 한 번만 수행
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log('✅ Firebase SDK 초기화 완료');
} catch (error) {
    console.error("❌ Firebase 초기화 실패:", error);
}

// 💡💡💡 FCM 토큰을 가져오는 함수 정의 (실제 구현) 💡💡💡
/**
 * Firebase Cloud Messaging(FCM) 토큰을 비동기적으로 가져옵니다.
 * 알림 권한을 요청하고 토큰을 가져옵니다.
 * @returns {Promise<string | null>} FCM 등록 토큰 또는 오류 발생 시 null.
 */
const getFCMToken = async (): Promise<string | null> => {
    if (!messaging || !VAPID_KEY ) {
        console.warn("⚠️ FCM Messaging이 초기화되지 않았거나 VAPID_KEY가 설정되지 않았습니다.");
        return null;
    }

    // 알림 권한을 요청합니다.
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission not granted.');
            return null;
        }

        // getToken 호출: 토큰을 가져오거나 생성합니다.
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (token) {
            return token;
        } else {
            console.warn('No registration token available after permission granted.');
            return null;
        }
    } catch (error) {
        // 'messaging/unsupported-browser' 등의 오류가 발생할 수 있음
        console.error("FCM getToken failed:", error);
        return null;
    }
};


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

  // 🚨 리다이렉트 경로를 하드코딩 대신 상태나 인자로 받는 것이 좋지만, 기존 로직에 맞춥니다.
  const BACKEND_BASE_URL = 'http://localhost:8080';
  const DEFAULT_REDIRECT_URL = 'http://localhost:5173/home';

  // 💡💡💡 FCM 토큰을 서버에 전송하는 별도 함수를 훅 내부에 정의 (userId를 사용) 💡💡💡
  const sendFcmTokenToServer = useCallback(async (token: string, userId: string) => {
    try {
        // 백엔드 DTO에 맞춰 userId를 Number로 변환하여 전송합니다.
        // userId가 이미 string이므로, 백엔드가 string을 받는다면 Number() 호출을 제거해도 됩니다.
        const response = await axios.post(`${BACKEND_BASE_URL}/api/notifications/token`, {
            userId: Number(userId), 
            fcmToken: token
        });
        console.log("✅ FCM 토큰 서버 전송 성공:", response.data);
    } catch (error) {
        console.error("❌ FCM 토큰 서버 전송 실패:", error);
    }
  }, [BACKEND_BASE_URL]); 


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

  // 실제 카카오 로그인 프로세스를 시작하는 함수 (FCM 토큰 등록 로직 추가)
  const startKakaoLogin = useCallback(() => {
    console.log("👉 카카오 로그인 버튼 클릭됨");
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      setError("❌ 카카오 SDK가 로드/초기화되지 않았습니다.");
      console.error("❌ startKakaoLogin: 카카오 SDK가 로드/초기화되지 않았습니다.");
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    setIsLoggedIn(false);

    window.Kakao.Auth.login({
      success: async (authObj: KakaoAuthResponse) => {
        console.log('👍 카카오 SDK 로그인 성공 (프론트엔드):', authObj);

        // 💡💡💡 1. FCM 토큰을 비동기적으로 미리 가져옵니다. 💡💡💡
        let fcmToken: string | null = null;
        try {
            fcmToken = await getFCMToken(); 
            if (fcmToken) {
                console.log('✅ FCM 토큰 획득:', fcmToken);
            } else {
                console.warn('⚠️ FCM 토큰을 가져오지 못했습니다. 백엔드에 토큰 없이 요청합니다.');
            }
        } catch (e) {
            console.error('❌ FCM 토큰 획득 실패:', e);
        }
        
        try {
          // 💡💡💡 2. 카카오 액세스 토큰으로 백엔드 로그인 요청 (FCM 토큰 포함) 💡💡💡
          const requestBody: { accessToken: string } = {
              accessToken: authObj.access_token,
          };

          const backendResponse = await fetch(`${BACKEND_BASE_URL}/api/auth/kakao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody), // FCM 토큰 포함
          });

          if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            throw new Error(errorData.message || '백엔드 로그인 처리 실패');
          }

          const responseData: BackendLoginResponse = await backendResponse.json();
          console.log('🎉 백엔드 로그인 성공 (서버로부터 응답):', responseData);
          
          // 토큰과 userId를 Local Storage에 저장하는 로직을 통합
          if (responseData.token) {
            console.log('저장할 토큰:', responseData.token);
            localStorage.setItem('userToken', responseData.token);
          }
          
          if (responseData.user?.id) {
                // 💡💡💡 userId 확보 💡💡💡
            const receivedUserId = responseData.user.id; 

            localStorage.setItem('userId', receivedUserId);
            console.log('userId 저장 완료:', receivedUserId);
            setUserData(responseData.user); 

                // 💡💡💡 3. userId를 얻은 후, fcmToken을 별도 API로 전송합니다. 💡💡💡
            if (fcmToken) {
                await sendFcmTokenToServer(fcmToken, receivedUserId); 
            }
          } else {
                console.error('❌ 백엔드 응답에 user.id가 누락되었습니다.');
            }

          setIsLoggedIn(true);

          // 백엔드에서 받은 redirectUrl로 이동하는 로직 추가
          if (responseData.redirectUrl) {
            console.log(`➡️ ${responseData.redirectUrl} 로 리다이렉트합니다.`);
            window.location.href = responseData.redirectUrl;
          } else {
            console.warn('백엔드에서 redirectUrl을 받지 못했습니다. 기본 페이지로 이동합니다.');
            window.location.href = DEFAULT_REDIRECT_URL; // 기본값 설정
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
  }, [kakaoAppKey, sendFcmTokenToServer, BACKEND_BASE_URL]); 


  // 로그아웃 함수 (FCM 토큰 제거 로직 추가)
  const logoutKakao = useCallback(async () => { 
    const userId = localStorage.getItem('userId');
    const userToken = localStorage.getItem('userToken');

    // 💡💡💡 1. FCM 토큰 제거 요청 💡💡💡
    if (userId && userToken) {
        try {
            // 현재 활성화된 FCM 토큰을 가져옵니다.
            const fcmToken = await getFCMToken(); 
            
            if (fcmToken) {
                console.log('FCM 토큰을 백엔드에 제거 요청:', fcmToken);
                // 🚨 백엔드 FCM 토큰 제거 API 엔드포인트 호출
                const response = await fetch(`${BACKEND_BASE_URL}/api/auth/fcm/remove`, { 
                    method: 'POST', // 서버 API 스펙에 따라 POST 또는 DELETE
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`, // JWT 토큰을 사용하여 인증
                    },
                    body: JSON.stringify({ 
                        userId: userId, // 필요한 경우
                        fcmToken: fcmToken,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('❌ 백엔드 FCM 토큰 제거 실패:', errorData.message);
                } else {
                    console.log('✅ 백엔드 FCM 토큰 제거 성공');
                }
            } else {
                console.warn('FCM 토큰을 가져올 수 없어 백엔드에 제거 요청을 생략합니다.');
            }
        } catch (e) {
            console.error('FCM 토큰 제거 API 호출 중 오류 발생:', e);
        }
    }

    // 2. 카카오 SDK 로그아웃 및 클라이언트 상태 정리
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.logout(() => {
        console.log('카카오 로그아웃 완료 (클라이언트)');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId'); // userId도 로그아웃 시 제거
        setIsLoggedIn(false);
        setUserData(null);
        setError(null);
        // 로그아웃 후 리다이렉트 (필요하다면)
        // window.location.href = DEFAULT_REDIRECT_URL; 
      });
    } else {
        // SDK가 없으면 로컬 스토리지 정리만 수행
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId'); 
        setIsLoggedIn(false);
        setUserData(null);
        setError(null);
    }
  }, [BACKEND_BASE_URL]); 

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