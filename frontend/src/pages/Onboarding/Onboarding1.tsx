// src/pages/Onboarding1.tsx
import onboarding1 from "../../assets/character/onboarding1.png";

export default function Onboarding1() {
  return (
    <div className="text-center">
      <img
        src={onboarding1}
        alt="onboarding1"
        className="w-64 h-64 object-contain mx-auto mb-16 mt-16"
      />
      <h3 className="text-left inline-block mx-auto text-[22px] font-bold leading-snug">
        좋은 뉴스 한입<br />
        어렵게 찾을 필요 없이<br />
        검색과 맞춤 추천까지
      </h3>
    </div>
  );
}