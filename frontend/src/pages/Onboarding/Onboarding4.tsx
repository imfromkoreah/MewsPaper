// src/pages/Onboarding4.tsx
import { useState } from "react";

const interests = [
  { id: "politics", label: "정치", icon: "🏛️" },
  { id: "economy", label: "경제", icon: "💰" },
  { id: "society", label: "사회", icon: "🏙️️" },
  { id: "culture", label: "생활/문화", icon: "🎨" },
  { id: "it", label: "IT/과학", icon: "💻" },
  { id: "world", label: "세계", icon: "🌍" },
  { id: "ranking", label: "랭킹", icon: "🏆" },
  { id: "trend", label: "트렌드", icon: "🗣" },
];

export default function Onboarding4() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[375px] mx-auto px-6 py-4 mt-12 text-left h-auto flex flex-col items-start">
      {/* 상단 텍스트 영역 */}
      <div className="mb-6">
        <h2 className="font-['Inter'] text-[22px] font-bold leading-9 text-[#090a0a]">
          마지막으로,
          <br />
          관심사를 선택해 주세요
        </h2>
        <p className="text-sm text-[#090a0a] mt-1">
          관심사에 맞는 뉴스레터를 추천해 줄게요!
        </p>
      </div>

      {/* 관심사 버튼 그룹 */}
      <div className="self-center grid grid-cols-2 gap-x-4 gap-y-4">
        {interests.map(({ id, label, icon }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleInterest(id)}
              className={`
                w-[130px] h-[69px] rounded-[7px] border
                shadow-[0px_10px_10px_0px_rgba(0,0,0,0.05)]
                border-[#cacaca]/30
                flex flex-col items-center justify-center
                cursor-pointer
                ${isSelected ? "bg-[#4f46e5] border-[#4f46e5]" : "bg-white"}
              `}
              aria-pressed={isSelected}
            >
              <span
                className={`text-[15px] ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {icon}
              </span>
              <span
                className={`text-sm font-normal leading-none mt-1 ${
                  isSelected ? "text-white" : "text-black"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 하단 안내 문구 */}
      <p className="text-xs text-[#6c7072] mt-6 self-center">
        나중에 설정에서 변경할 수 있어요!
      </p>
    </div>
  );
}
