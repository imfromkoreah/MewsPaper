// src/pages/Onboarding.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import onboarding1 from '../assets/onboarding1.png';


const onboardingData = [
  {
    title: (
      <>
        좋은 뉴스 한입<br />
        어렵게 찾을 필요 없이<br />
        검색과 맞춤 추천까지
      </>
    ),
    image: onboarding1,
  },
  {
    title: '가짜뉴스 차단',
    image: '/onboarding2.svg',
  },
  {
    title: '뉴스 클리핑 기능',
    image: '/onboarding3.svg',
  },
  {
    title: '지금 시작해보세요',
    image: '/onboarding4.svg',
  },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (page < onboardingData.length - 1) {
      setPage((prev) => prev + 1);
    } else {
      navigate('/home');
    }
  };

return (
  <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
    <div className="flex flex-col items-start text-left relative" style={{ minHeight: '460px' }}>
      <img
        src={onboardingData[page].image}
        alt="onboarding"
        className="w-64 h-64 object-contain mb-16"
        style={{ marginLeft: '72px', marginTop: '80px' }}
      />
      <h2
        className="text-2xl font-bold max-w-xs"
        style={{ marginLeft: '85px', marginTop: '0', lineHeight: '1.75rem' }}
      >
        {onboardingData[page].title}
      </h2>
    </div>

    {/* 인디케이터 */}
    <div className="flex justify-center items-center gap-2" style={{ marginTop: '40px', marginBottom: '8px' }}>
      {onboardingData.map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i === page ? 'bg-[#6a4dff]' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>

    {/* 버튼 */}
    <div className="flex justify-center" style={{ marginBottom: '72px' }}>
      <div
        onClick={next}
        role="button"
        tabIndex={0}
        className="w-[220px] px-8 py-4 bg-[#6a4dff] rounded-[48px] inline-flex justify-center items-center cursor-pointer select-none"
        onKeyPress={(e) => {
          if (e.key === 'Enter') next();
        }}
      >
        <div className="flex-1 text-white text-base font-bold font-['Inter'] leading-none text-center">
          {page === onboardingData.length - 1 ? '시작하기' : '다음'}
        </div>
      </div>
    </div>
  </div>
);

}
