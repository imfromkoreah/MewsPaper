import { useState, useEffect } from 'react';

interface Onboarding2Props {
  onNicknameChange: (nickname: string) => void;
  nickname: string; // 현재 닉네임 값 (부모로부터 받음)
  showWarning: boolean; // 부모가 경고 표시를 요청하는지 여부
}

export default function Onboarding2({ onNicknameChange, nickname, showWarning }: Onboarding2Props) {
  // 컴포넌트 내부에서 input 값을 관리 (부모의 nickname prop과 동기화)
  const [inputValue, setInputValue] = useState(nickname);

  // input 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onNicknameChange(value); // 부모 컴포넌트의 상태를 업데이트
  };

  // 부모로부터 받은 nickname prop이 변경될 경우 내부 상태도 업데이트 (초기 로드 또는 외부 변경 시)
  useEffect(() => {
    setInputValue(nickname);
  }, [nickname]);

  return (
    <div className="w-[375px] mx-auto px-6 py-4 mt-12 text-left">
      {/* 텍스트 영역 */}
      <div className="mb-6">
        <h1 className="font-['Inter'] text-xl font-bold leading-9 text-[#090a0a]">
          고양이 앵커의 이름을 정해 주세요
        </h1>
        <p className="text-sm text-[#090a0a]">
          뮤스페이퍼에서 사용하는 앵커 이름에 표기됩니다
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="냥냥박사"
          className={`w-full h-12 px-4 bg-white rounded-lg border text-base text-[#72777a] placeholder:text-[#72777a]/60 outline-none
            ${showWarning && inputValue.trim() === '' ? 'border-red-500' : 'border-[#e3e4e5]'}`}
          value={inputValue} // input 값을 상태와 바인딩
          onChange={handleChange} // 값 변경 핸들러 연결
        />
        {/* 경고 메시지 표시 */}
        {showWarning && inputValue.trim() === '' && (
          <p className="text-red-500 text-xs mt-2">닉네임을 입력해주세요!</p>
        )}
      </div>

      <p className="text-xs text-[#6c7072] mt-4 leading-none">
        나중에 설정에서 변경할 수 있어요!
      </p>
    </div>
  );
}