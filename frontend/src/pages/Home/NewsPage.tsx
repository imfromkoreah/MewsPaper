import { useState, useEffect, useRef } from 'react';
import GrayDot from '../../assets/svg/graydot.svg';

const tabs = [
  { id: 'general', label: '종합' },
  { id: 'politics', label: '정치' },
  { id: 'economy', label: '경제' },
  { id: 'society', label: '사회' },
  { id: 'culture', label: '생활/문화', width: 62 },
  { id: 'world', label: '세계' },
  { id: 'ranking', label: '랭킹' },
];

export default function News() {
  const [activeTab, setActiveTab] = useState('general');
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === activeTab);
    const tabEl = tabsRef.current[index];
    if (tabEl) {
      const left = tabEl.offsetLeft - 12; // 왼쪽으로 여유 공간 확보
      const width = tabEl.offsetWidth + 24; // 양쪽 여유 공간 합산
      setBarStyle({ left, width });
    }
  }, [activeTab]);


  return (
    <main>
      <div className="w-full h-[93px] relative mx-auto">
        {/* Top 10 뉴스 타이틀 */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-black text-[20px] font-bold font-['Pretendard'] leading-tight">
          Top 10 뉴스
        </div>

        {/* 서브 타이틀 + 점 */}
        <div className="absolute left-1/2 top-[24px] flex items-center space-x-1 -translate-x-1/2 mt-1">
          <span className="text-black/60 text-[12px] font-normal font-['Pretendard'] leading-tight">
            22,955개 뉴스 중 Top 10
          </span>
          <img src={GrayDot} width={13} height={13} alt="gray dot" />
        </div>

        {/* 카테고리 탭 */}
        <div className="absolute top-[66px] flex justify-center w-full text-black/60 text-base font-bold font-['Pretendard'] leading-tight space-x-[24px]">
          {tabs.map((tab, i) => (
            <div
              key={tab.id}
              ref={el => {
                tabsRef.current[i] = el;
              }}
              className={`text-center cursor-pointer ${
                activeTab === tab.id ? 'text-[#6a4dff]' : ''
              }`}
              style={{ width: tab.width ? `${tab.width}px` : '28px' }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* 탭 하이라이트 바 */}
        <div className="w-full h-1.5 absolute left-0 top-[89px] bg-[#e8ebed] rounded-[100px] overflow-hidden">
          <div
            className="h-full bg-[#6a4dff] rounded-[100px] transition-all duration-300"
            style={{
              width: barStyle.width,
              transform: `translateX(${barStyle.left}px)`,
            }}
          />
        </div>
      </div>
    </main>
  );
}
