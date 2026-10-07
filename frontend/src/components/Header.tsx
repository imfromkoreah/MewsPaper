import React from 'react';
import LeftIcon from '../assets/svg/left.svg';

interface HeaderProps {
  title: string;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="w-full bg-white px-6 py-4 flex items-center justify-between">
      {/* 뒤로가기 버튼 */}
      <button
        type="button"
        className="w-6 h-6 flex items-center justify-center focus:outline-none"
        onClick={onBack}
      >
        <img src={LeftIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      {/* 가운데 타이틀 */}
      <div className="flex-1 text-center">
        <h2
          className="text-black text-[18px] font-inter leading-[18px] tracking-normal"
          style={{ lineHeight: '18px', letterSpacing: 0 }}
        >
          {title}
        </h2>
      </div>

      {/* 오른쪽 빈 공간 (뒤로가기 아이콘 크기 맞춤용) */}
      <div className="w-6 h-6" />
    </header>
  );
};

export default Header;
