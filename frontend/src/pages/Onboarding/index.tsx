import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4';
import axios from 'axios';

const pages = [Onboarding1, Onboarding2, Onboarding3, Onboarding4];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const next = async () => {
    if (page === 1) { // Onboarding2 페이지 (닉네임 입력)
      try {
        await axios.post('http://localhost:8080/api/users/nickname', {
          userId: 4284023611, // <<< 서현님 kakao 테스트 id
          nickname: name,
        });
        alert('성공적으로 저장되었습니다!');
      } catch (error) {
        console.error('저장 중 오류 발생:', error);
        alert('저장 실패!');
        return;
      }
    }

    if (page < pages.length - 1) {
      setPage((prev) => prev + 1);
    } else {
      navigate('/home');
    }
  };

  const PageComponent = pages[page] as React.ComponentType<any>;
  
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="flex-grow">
        {page === 0
          ? <PageComponent />
          : <PageComponent name={name} setName={setName} />}
      </div>

      <div className="flex justify-center items-center gap-2 mt-10 mb-14">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i === page ? 'bg-[#6a4dff]' : 'bg-gray-300'}`}
          />
        ))}
      </div>

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