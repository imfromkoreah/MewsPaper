// src/pages/Onboarding1.tsx
import onboardingimg from "../../assets/character/search.png";

export default function Onboarding1() {
  return (
    <div className="text-center">
      <img
        src={onboardingimg}
        alt="onboardingimg"
        className="w-[270px] h-auto object-contain mx-auto mt-12"
      />
      <h3 className="text-left inline-block mx-auto text-[22px] font-bold leading-snug">
        좋은 뉴스 한입<br />
        어렵게 찾을 필요 없이<br />
        검색과 맞춤 추천까지
      </h3>
    </div>
  );
}