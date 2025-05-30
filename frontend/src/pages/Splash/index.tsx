import newsChar from "../../assets/character/news.png";
import kakaoIcon from "../../assets/svg/kakao.svg";
import googleIcon from "../../assets/svg/google.svg";
import appleIcon from "../../assets/svg/apple.svg";

export default function Splash() {
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="w-[375px] h-[812px] relative bg-white rounded-[32px] overflow-hidden">

        {/* 메인 이미지 */}
        <img
          src={newsChar}
          alt="newsChar"
          className="w-[320px] h-auto object-contain mx-auto mt-12"
        />

        {/* 앱 이름 및 설명 */}
        <div className="absolute top-[380px] w-full flex flex-col items-center">
          <div className="text-2xl font-bold font-['Pretendard'] leading-loose text-center">
            <span className="text-[#090a0a]">Mews</span>
            <span className="text-[#6b4eff]">Paper</span>
          </div>
          <div className="text-[#090a0a]/50 text-lg font-bold font-['Inter'] leading-none mt-0 pt-0">
            뉴스 한입
          </div>
        </div>

        {/* 로그인 버튼 및 회원가입 그룹 */}
        <div className="absolute top-[520px] w-full flex flex-col items-center space-y-4">
          {/* 카카오 로그인 버튼 */}
          <button className="w-[294px] h-12 flex items-center justify-center bg-[#fee500] rounded-lg">
            <img src={kakaoIcon} alt="카카오" className="w-[18px] h-[18px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              카카오로 로그인
            </span>
          </button>

          {/* 애플 로그인 버튼 */}
          <button className="w-[294px] h-12 flex items-center justify-center bg-neutral-100 rounded-lg">
            <img src={appleIcon} alt="애플" className="w-[19px] h-[19px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              Apple로 로그인
            </span>
          </button>

          {/* 구글 로그인 버튼 */}
          <button className="w-[294px] h-12 flex items-center justify-center bg-neutral-100 rounded-lg">
            <img src={googleIcon} alt="구글" className="w-[19px] h-[19px] mr-2" />
            <span className="text-[#111213] text-xs font-bold font-['Noto_Sans_KR']">
              Google로 로그인
            </span>
          </button>

          {/* 회원가입 텍스트 */}
          <div className="pt-2">
            <span className="text-[#7d7d7d] text-xs font-normal font-['Noto_Sans_KR']">
              계정이 없나요?{" "}
            </span>
            <button
              onClick={() => alert("회원가입 클릭링~!")}
              className="text-[#7d7d7d] text-xs font-normal font-['Noto_Sans_KR'] underline focus:outline-none"
            >
              회원가입
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
