interface CategoryTabsProps {
  selected: 'attendance' | 'scrap';
  onSelect: (tab: 'attendance' | 'scrap') => void;
}

export default function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="w-[360px] h-11 relative mx-auto">
      {/* 탭 텍스트 영역 */}
      <div className="w-[360px] h-11 px-[70px] py-2.5 left-0 top-0 absolute bg-[rgb(252,252,252)] rounded-t-[10px] inline-flex justify-between items-center cursor-pointer select-none">
        <div
          className={`text-center text-black text-sm font-bold font-['Pretendard'] leading-normal tracking-tight ${
            selected === 'attendance' ? '' : 'opacity-60'
          }`}
          onClick={() => onSelect('attendance')}
        >
          나의 출석
        </div>
        <div
          className={`text-center text-black text-sm font-bold font-['Pretendard'] leading-normal tracking-tight ${
            selected === 'scrap' ? '' : 'opacity-60'
          }`}
          onClick={() => onSelect('scrap')}
        >
          읽은 뉴스
        </div>
      </div>

      {/* 밑줄 바탕 */}
      <div className="w-[360px] h-1 left-0 top-[40px] absolute bg-[#e8ebed] rounded-[100px] overflow-hidden">
        <div
          className="h-1 absolute bg-[#6a4dff] rounded-[100px] transition-all duration-300"
          style={{
            width: '85px',
            top: 0,
            left: selected === 'attendance' ? '52px' : '220px',
          }}
        />
      </div>
    </div>
  );
}
