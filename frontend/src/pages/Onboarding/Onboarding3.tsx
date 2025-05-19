// src/pages/Onboarding3.tsx
import { useState } from 'react';

export default function Onboarding3() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1); // 기본 선택: 식후 루틴

  const routines = [
    { label: '출퇴근 루틴 (AM 8:00 / PM 18:30)' },
    { label: '식후 루틴 (PM 12:30 / PM 19:30)' },
    { label: '잠자리 루틴 (AM 8:00 / PM 22:00)' },
  ];

  return (
    <div className="w-[375px] mx-auto px-6 py-4 mt-12 text-left">
      {/* 텍스트 영역 */}
      <div className="mb-4">
        <h2 className="font-['Inter'] text-xl font-bold leading-9 text-[#090a0a]">
          매일 뉴스를 볼 시간을 골라 주세요
        </h2>
        <p className="text-sm text-[#090a0a]">
          원하는 뉴스 배달 시간대를 선택해 주세요
        </p>
      </div>

      {/* 루틴 선택 리스트 */}
      <div className="space-y-4">
        {routines.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="flex items-center w-full bg-white rounded-lg border border-[#e3e4e5] h-12 px-4"
          >
            <div
              className="w-[18px] h-[18px] rounded-full mr-3"
              style={{
                backgroundColor: selectedIndex === index ? '#86da52' : '#9a9a9a70',
              }}
            />
            <span className="text-sm text-[#72777a]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 하단 설명 */}
      <p className="text-xs text-[#6c7072] mt-4">
        나중에 설정에서 변경할 수 있어요!
      </p>
    </div>
  );
}
