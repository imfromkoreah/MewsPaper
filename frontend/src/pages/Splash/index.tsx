import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newsChar from "../../assets/character/news.png";
import kakaoIcon from "../../assets/svg/kakao.svg";
import googleIcon from "../../assets/svg/google.svg";
import naverIcon from "../../assets/svg/naver.svg";
// KakaoLogin 훅 임포트 경로가 'index'인데, '.ts'로 끝나도록 변경되었는지 확인
// 만약 'hooks/index.ts'라면 'hooks'로 임포트 가능합니다.
import useKakaoLogin from './hooks/index'; // 경로 확인 필요
import useNaverLogin from './hooks/useNaverLogin'; // 새로 만든 네이버 훅

// 환경 변수들 불러오기
const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_CALLBACK_URL = import.meta.env.VITE_NAVER_CALLBACK_URL;
const FRONTEND_ORIGIN = import.meta.env.VITE_FRONTEND_ORIGIN; // 프론트엔드 Origin
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // 백엔드 URL

// 환경 변수 설정 여부 경고 (이전과 동일)
if (
  !KAKAO_APP_KEY || KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_APP_KEY' || typeof KAKAO_APP_KEY === 'undefined'
) {
  console.error("환경 변수 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았거나 기본값입니다. .env 파일을 확인해주세요.");
}
if (
    !NAVER_CLIENT_ID || NAVER_CLIENT_ID === 'YOUR_NAVER_CLIENT_ID' || typeof NAVER_CLIENT_ID === 'undefined'
) {
    console.error("환경 변수 VITE_NAVER_CLIENT_ID가 설정되지 않았거나 기본값입니다. .env 파일을 확인해주세요.");
}
if (
    !NAVER_CALLBACK_URL || NAVER_CALLBACK_URL === 'YOUR_NAVER_CALLBACK_URL' || typeof NAVER_CALLBACK_URL === 'undefined'
) {
    console.error("환경 변수 VITE_NAVER_CALLBACK_URL이 설정되지 않았거나 기본값입니다. .env 파일을 확인해주세요.");
}
if (
    !FRONTEND_ORIGIN || FRONTEND_ORIGIN === 'YOUR_FRONTEND_ORIGIN' || typeof FRONTEND_ORIGIN === 'undefined'
) {
    console.error("환경 변수 VITE_FRONTEND_ORIGIN이 설정되지 않았거나 기본값입니다. .env 파일을 확인해주세요. (예: http://localhost:5173)");
}
if (
    !BACKEND_BASE_URL || BACKEND_BASE_URL === 'YOUR_BACKEND_BASE_URL' || typeof BACKEND_BASE_URL === 'undefined'
) {
    console.error("환경 변수 VITE_BACKEND_BASE_URL이 설정되지 않았거나 기본값입니다. .env 파일을 확인해주세요. (예: http://localhost:8080)");
}


export default function Splash() {
  const navigate = useNavigate();

  // Kakao 로그인 훅 사용: navigate 함수를 인자로 전달
  const {
    startKakaoLogin,
    isLoggingIn: isKakaoLoggingIn,
    isLoggedIn: isKakaoLoggedIn,
    error: kakaoError,
    userData: kakaoUserData,
  } = useKakaoLogin(KAKAO_APP_KEY, navigate); // <-- navigate 인자 추가

  // Naver 로그인 훅 사용
  const {
    startNaverLogin,
    isLoggingIn: isNaverLoggingIn,
    isLoggedIn: isNaverLoggedIn,
    error: naverError,
    userData: naverUserData,
  } = useNaverLogin({
    naverClientId: NAVER_CLIENT_ID,
    naverCallbackUrl: NAVER_CALLBACK_URL,
    frontendOrigin: FRONTEND_ORIGIN,
    backendBaseUrl: BACKEND_BASE_URL,
  });

  // 카카오 로그인 성공 시 처리 (이 부분은 훅 내부에서 navigate를 호출하기 때문에 주석 처리해도 됩니다)
  // 하지만 훅에서 navigate를 호출하는 것이 확인되므로 이 useEffect는 남겨둬도 무방합니다.
  useEffect(() => {
    if (isKakaoLoggedIn) {
      console.log("카카오 로그인 성공! 다음 페이지로 이동 준비:", kakaoUserData);
      // useKakaoLogin 훅 내부에서 navigate('/main') 또는 responseData.redirectUrl로 이동을 처리합니다.
      // 필요하다면 이곳에서 추가 로직을 실행할 수 있습니다.
    }
  }, [isKakaoLoggedIn, kakaoUserData]);

  // 네이버 로그인 성공 시 처리
  useEffect(() => {
    if (isNaverLoggedIn) {
      console.log("네이버 로그인 성공! 다음 페이지로 이동 준비:", naverUserData);
      // useNaverLogin 훅 내부에서 navigate('/main') 또는 responseData.redirectUrl로 이동을 처리합니다.
      // 필요하다면 이곳에서 추가 로직을 실행할 수 있습니다.
    }
  }, [isNaverLoggedIn, naverUserData]);

  // Kakao 앱 키가 설정되지 않은 경우 에러 메시지 렌더링 (이전과 동일)
  if (
    !KAKAO_APP_KEY || KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_APP_KEY' || typeof KAKAO_APP_KEY === 'undefined'
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-red-500">
        <p>환경 변수 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.</p>
        <p>.env 파일을 확인하고 유효한 카카오 앱 키를 설정해주세요.</p>
        <p>혹은 카카오 SDK 로딩이 제대로 되지 않았는지 확인해주세요.</p>
      </div>
    );
  }

  // Naver 로그인 관련 에러 표시 (선택 사항)
  if (naverError) {
    console.error("Naver 로그인 에러:", naverError);
    // 사용자에게 에러 메시지를 표시하는 UI를 추가할 수 있습니다.
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="w-[375px] h-[812px] relative bg-white rounded-[32px] overflow-hidden">
        <img
          src={newsChar}
          alt="newsChar"
          className="w-[320px] h-auto object-contain mx-auto mt-8"
        />
        <div className="absolute top-[360px] w-full flex flex-col items-center">
          <div className="text-2xl font-bold font-['Pretendard'] leading-loose text-center">
            <span className="text-[#090a0a]">Mews</span>
            <span className="text-[#6b4eff]">Paper</span>
          </div>
          <div className="text-[#090a0a]/50 text-lg font-bold font-['Inter'] leading-none mt-0 pt-0">
            뉴스 한입
          </div>
        </div>
        <div className="absolute top-[490px] w-full flex flex-col items-center space-y-4">
          <button
            className="w-[294px] h-12 flex items-center justify-center bg-[#fee500] rounded-lg"
            onClick={startKakaoLogin}
            disabled={isKakaoLoggingIn || isNaverLoggingIn}
          >
            <img src={kakaoIcon} alt="카카오" className="w-[18px] h-[18px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              {isKakaoLoggingIn ? 'Kakao 로그인 중...' : 'Kakao로 로그인'}
            </span>
          </button>
          <button
            className="w-[294px] h-12 flex items-center justify-center bg-[#2DB400] rounded-lg"
            onClick={startNaverLogin}
            disabled={isKakaoLoggingIn || isNaverLoggingIn}
          >
            <img src={naverIcon} alt="네이버" className="w-[15px] h-[15px] mr-2" />
            <span className="text-[#ffffff] text-xs font-bold font-['Noto_Sans_KR']">
              {isNaverLoggingIn ? 'Naver 로그인 중...' : 'Naver로 로그인'}
            </span>
          </button>
          <button className="w-[294px] h-12 flex items-center justify-center bg-neutral-100 rounded-lg" disabled={isKakaoLoggingIn || isNaverLoggingIn}>
            <img src={googleIcon} alt="구글" className="w-[19px] h-[19px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              Google로 로그인
            </span>
          </button>
          <button
            className="w-[294px] h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg"
            onClick={() => navigate('/login')}
            disabled={isKakaoLoggingIn || isNaverLoggingIn}
          >
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              이메일로 로그인
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}