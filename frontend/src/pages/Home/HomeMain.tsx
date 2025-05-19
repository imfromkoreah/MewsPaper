// 홈 탭import React from 'react';

const HomeMain = () => {
  const attendanceIcons = new Array(7).fill('https://placehold.co/20x18');

  return (
    <div className="w-[311px] h-[198px] relative rounded-[20px] mx-auto mt-10">
      <div className="w-[311px] h-[198px] left-0 top-0 absolute bg-white rounded-2xl border border-[#cacaca]/50" />

      <div className="left-[78px] top-[55px] absolute text-center justify-start">
        <span className="text-[#090a0a]/30 text-lg font-bold font-['Inter'] leading-normal">7일 출석 중</span>
        <span className="text-[#090a0a] text-lg font-bold font-['Inter'] leading-normal"> 2일 출석</span>
      </div>

      <div className="left-[109px] top-[32px] absolute text-center justify-start text-[#090a0a] text-xs font-normal font-['Inter'] leading-none">
        04월 02일 수요일
      </div>

      <div className="w-3.5 h-3.5 left-[249px] top-[60px] absolute bg-[#6b4eff]" />

      <div className="w-[15px] h-[15px] left-[219px] top-[47px] absolute origin-top-left rotate-180 overflow-hidden">
        <div className="w-[3.75px] h-[7.5px] left-[5.62px] top-[3.75px] absolute outline outline-[1.5px] outline-offset-[-0.75px] outline-[#090a0a]" />
      </div>

      {attendanceIcons.map((src, idx) => (
        <img
          key={idx}
          className={`w-[19.63px] h-[18px] absolute top-[94px] left-[${61 + 28 * idx}px]`}
          src={src}
          alt={`출석아이콘${idx + 1}`}
        />
      ))}

      <div className="w-[280px] h-px left-[16px] top-[127px] absolute bg-[#d9d9d9]" />

      <div className="w-[132px] left-[100px] top-[143px] absolute text-center justify-start">
        <span className="text-[#090a0a] text-sm font-normal font-['Inter'] leading-tight">안 읽은 뉴스레터 </span>
        <span className="text-[#090a0a] text-sm font-bold font-['Inter'] leading-tight">3개</span>
      </div>

      <div className="w-[15px] h-[9.94px] left-[81px] top-[148px] absolute bg-[#666666]" />
    </div>
  );
};

export default HomeMain;
