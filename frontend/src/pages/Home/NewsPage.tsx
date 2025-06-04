import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GrayDot from '../../assets/svg/graydot.svg';
import Paper from '../../assets/Paper.png';
import HTMLFlipBook from 'react-pageflip';

const tabs = [
  { id: 'politics', label: '정치', categoryId: 100 },
  { id: 'economy', label: '경제', categoryId: 101 },
  { id: 'society', label: '사회', categoryId: 102 },
  { id: 'culture', label: '생활/문화', categoryId: 103, width: 62 },
  { id: 'world', label: '세계', categoryId: 104 },
  { id: 'it', label: 'IT/과학', categoryId: 105, width: 62 },
];

type Article = {
  uniqueLink: string;
  title: string;
  content: string;
  categoryId: number;
  source: string;
  publishedDate: string;
  url: string;
  thumbnailUrl: string;
  bias: string;
  createdAt: string;
  updatedAt: string;
};

export default function News() {
  const [activeTab, setActiveTab] = useState('politics');
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 탭 위치 계산
  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === activeTab);
    const tabEl = tabsRef.current[index];
    if (tabEl) {
      const left = tabEl.offsetLeft - 12;
      const width = tabEl.offsetWidth + 24;
      setBarStyle({ left, width });
    }
  }, [activeTab]);

  // 뉴스 가져오기
  useEffect(() => {
    const selected = tabs.find(tab => tab.id === activeTab);
    if (!selected) return;

    axios
      .get(`/api/news?categoryId=${selected.categoryId}`)
      .then(res => {
        console.log('받은 데이터:', res.data);
        setArticles(res.data || []);
        setCurrentIndex(0);
      })
      .catch(err => {
        console.error('뉴스 로딩 실패:', err);
        setArticles([]);
      });
  }, [activeTab]);

  const currentArticle = articles[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : articles.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < articles.length - 1 ? prev + 1 : 0));
  };

  return (
    <main className="w-full flex flex-col items-center relative">
      {/* 상단 영역 */}
      <div className="w-full h-[93px] relative mx-auto">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 text-black text-[20px] font-bold font-['Pretendard'] leading-tight">
          Top 10 뉴스
        </div>
        <div className="absolute left-1/2 top-[24px] flex items-center space-x-1 -translate-x-1/2 mt-1">
          <span className="text-black/60 text-[12px] font-normal font-['Pretendard'] leading-tight">
            카테고리별 뉴스 하이라이트
          </span>
          <img src={GrayDot} width={13} height={13} alt="gray dot" />
        </div>
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
              style={{ width: tab.width ? `${tab.width}px` : '35px', fontSize: '15px' }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
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

      <div className="relative mt-[60px] w-[480px] h-[500px]">
        {/* 신문 배경 */}
        <img
          src={Paper}
          alt="신문 배경"
          className="w-full h-full absolute top-0 left-0 z-0 object-cover"
        />

        {/* 그라데이션 효과 주려고
        세로선 걍 맞춰서 넣음 ㅋㅋㅋ
        (FlipBook 앞에 보이도록 z-30 설정) */}
        <div className="absolute top-[0px] left-[53px] w-[8px] h-[493px] bg-[#D4D4D4]/70 z-30" />

        {/* Flipbook */}
        {articles.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full text-gray-500 font-semibold z-20 relative">
            해당 카테고리의 뉴스가 없습니다.
          </div>
        ) : (
          <HTMLFlipBook
            width={370}
            height={490}
            className="relative z-20 overflow-hidden"
            showCover={false}
            size="fixed"
            maxShadowOpacity={0.3}
            mobileScrollSupport={true}
            style={{
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              marginTop: '-70px',
            }}
          >
            {articles.map((article, index) => (
              <div
                key={article.uniqueLink}
                className="relative flex flex-col items-center justify-start bg-[#E4E4E4] shadow-md h-full p-5"
                style={{
                  boxSizing: 'border-box',
                  maxWidth: '430px',
                  maxHeight: '410px',
                  backgroundColor: 'transparent',
                }}
              >
                {/* 랭킹 태그 */}
                <div className="absolute left-5 top-4">
                  <div className="px-3 py-1 bg-[#6B4EFF]/70 rounded-2xl">
                    <div className="text-[#ffffff] text-sm font-medium">
                      정치 <span className="font-bold">{index + 1}위</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mt-8 mb-2 w-full max-w-[350px] text-left line-clamp-2">
                  {article.title}
                </h3>
                <p className="mb-2 text-sm text-black-600">
                  날짜 데이터 가져오기{article.createdAt /* 날짜 데이터 출력 */}
                </p>
                <div className="w-full max-w-[350px] border-b border-gray-400 mb-4" />

                <img
                  src={article.thumbnailUrl}
                  alt="썸네일"
                  className="max-w-[250px] max-h-[150px] mb-3 rounded shadow"
                />
                <p className="text-sm line-clamp-5 text-center overflow-hidden">{article.content}</p>
              </div>
            ))}
          </HTMLFlipBook>
        )}
      </div>

      {/* 좌우 버튼 (필요시 사용 가능) */}
      {/*
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 rounded-r text-black"
        onClick={handlePrev}
      >
        ◀
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 px-2 py-1 rounded-l text-black"
        onClick={handleNext}
      >
        ▶
      </button>
      */}
    </main>
  );
}
