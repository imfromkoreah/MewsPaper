import { useState, useEffect } from 'react';

interface Onboarding2Props {
  onNicknameChange: (nickname: string) => void;
  nickname: string;
  showWarning: boolean;
}

export default function Onboarding2({ onNicknameChange, nickname, showWarning }: Onboarding2Props) {
  const [inputValue, setInputValue] = useState(nickname);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onNicknameChange(value);
  };

  useEffect(() => {
    setInputValue(nickname);
  }, [nickname]);

  return (
    <div className="w-[375px] mx-auto px-6 py-4 mt-12 text-left">
      <div className="mb-6">
        <h1 className="font-['Inter'] text-[22px] font-bold leading-9 text-[#090a0a]">
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
          value={inputValue}
          onChange={handleChange}
          className={`w-full h-12 px-4 bg-white rounded-lg border text-base text-[#72777a] placeholder:text-[#72777a]/60 outline-none
            ${showWarning && inputValue.trim() === '' ? 'border-red-500' : 'border-[#e3e4e5]'}`}
        />
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
