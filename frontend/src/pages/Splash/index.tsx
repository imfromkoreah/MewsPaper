import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newsChar from "../../assets/character/news.png";
import kakaoIcon from "../../assets/svg/kakao.svg";
import googleIcon from "../../assets/svg/google.svg";
import appleIcon from "../../assets/svg/apple.svg";
import naverIcon from "../../assets/svg/naver.svg";
import KakaoLogin from './hooks/index';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

if (
  !KAKAO_APP_KEY ||
  KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_APP_KEY' ||
  typeof KAKAO_APP_KEY === 'undefined'
) {
  console.error("환경 변수 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았거나 기본값입니다. .env 파일을 확인해주세요.");
}

export default function Splash() {
  const navigate = useNavigate();

  const {
    startKakaoLogin,
    isLoggingIn,
    isLoggedIn,
    error,
    userData,
  } = KakaoLogin(KAKAO_APP_KEY);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("로그인 성공! 다음 페이지로 이동 준비:", userData);
      // navigate('/main');
    }
  }, [isLoggedIn, userData]);

  if (
    !KAKAO_APP_KEY ||
    KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_APP_KEY' ||
    typeof KAKAO_APP_KEY === 'undefined'
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-red-500">
        <p>환경 변수 VITE_KAKAO_JAVASCRIPT_KEY가 설정되지 않았습니다.</p>
        <p>.env 파일을 확인하고 유효한 카카오 앱 키를 설정해주세요.</p>
        <p>혹은 카카오 SDK 로딩이 제대로 되지 않았는지 확인해주세요.</p>
      </div>
    );
  }

  return (
    
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="w-[375px] h-[812px] relative bg-white rounded-[32px] overflow-hidden">
        <img
          src={newsChar}
          alt="newsChar"
          className="w-[320px] h-auto object-contain mx-auto mt-12"
        />
        <div className="absolute top-[380px] w-full flex flex-col items-center">
          <div className="text-2xl font-bold font-['Pretendard'] leading-loose text-center">
            <span className="text-[#090a0a]">Mews</span>
            <span className="text-[#6b4eff]">Paper</span>
          </div>
          <div className="text-[#090a0a]/50 text-lg font-bold font-['Inter'] leading-none mt-0 pt-0">
            뉴스 한입
          </div>
        </div>
        <div className="absolute top-[515px] w-full flex flex-col items-center space-y-4">
          <button
            className="w-[294px] h-12 flex items-center justify-center bg-[#fee500] rounded-lg"
            onClick={startKakaoLogin}
          >
            <img src={kakaoIcon} alt="카카오" className="w-[18px] h-[18px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              Kakao로 로그인
            </span>
          </button>
          <button className="w-[294px] h-12 flex items-center justify-center bg-[#2DB400] rounded-lg">
            <img src={naverIcon} alt="네이버" className="w-[15px] h-[15px] mr-2" />
            <span className="text-[#ffffff] text-xs font-bold font-['Noto_Sans_KR']">
              Naver로 로그인
            </span>
          </button>
          <button className="w-[294px] h-12 flex items-center justify-center bg-neutral-100 rounded-lg">
            <img src={googleIcon} alt="구글" className="w-[19px] h-[19px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              Google로 로그인
            </span>
          </button>
          <button
            className="w-[294px] h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg"
            onClick={() => navigate('/login')}
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
