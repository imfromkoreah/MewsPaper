//Onboarding 메인 화면 서브 화면으로 Onboarding1~4
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4';

const pages = [Onboarding1, Onboarding2, Onboarding3, Onboarding4];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (page < pages.length - 1) {
      setPage((prev) => prev + 1);
    } else {
      navigate('/home');
    }
  };

  const PageComponent = pages[page];

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
      {/* 온보딩 콘텐츠 */}
      <div className="flex-grow">
        <PageComponent />
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center items-center gap-2 mt-10 mb-14">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i === page ? 'bg-[#6a4dff]' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex justify-center mb-20">
        <button
          onClick={next}
          className="font-['Inter'] w-[220px] px-8 py-4 bg-[#6a4dff] rounded-[48px] text-white text-base font-bold leading-none"
        >
          {page === pages.length - 1 ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
