import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';

import SummaryInfoIcon from '../../assets/svg/down_arrow.svg';
import LikeOnIcon from '../../assets/svg/like_on.svg';
import DislikeOnIcon from '../../assets/svg/dislike_on.svg';
import ClipOnIcon from '../../assets/svg/clip_on.svg';
import LikeOffIcon from '../../assets/svg/like_off.svg';
import DisLikeOffIcon from '../../assets/svg/dislike_off.svg';
import ClipOffIcon from '../../assets/svg/clip_off.svg';

const tabs = [
  { id: 'politics', label: '정치', categoryId: 100 },
  { id: 'economy', label: '경제', categoryId: 101 },
  { id: 'society', label: '사회', categoryId: 102 },
  { id: 'culture', label: '생활/문화', categoryId: 103 },
  { id: 'world', label: '세계', categoryId: 104 },
  { id: 'it', label: 'IT/과학', categoryId: 105 },
];

export default function NewsDetailPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uniqueLink = queryParams.get('link');
  const rank = queryParams.get('rank');
  const navigate = useNavigate();

  const [news, setNews] = useState<any | null>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [clipped, setClipped] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ✅ 토스트 자동 사라짐
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 1800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!uniqueLink) return;

    const userId = localStorage.getItem('userId');

    axios
      .get(`http://localhost:8080/api/news/detail?link=${encodeURIComponent(uniqueLink)}`)
      .then(res => {
        setNews(res.data);
      })
      .catch(err => console.error('뉴스 상세 조회 실패:', err));

    if (userId) {
      axios
        .get(`http://localhost:8080/api/scrap/list?userId=${userId}`)
        .then(res => {
          const isClipped = res.data.some((item: any) => item.uniqueLink === uniqueLink);
          setClipped(isClipped);
        })
        .catch(err => console.error('스크랩 리스트 조회 실패:', err));
    }
  }, [uniqueLink]);

  const handleBack = () => navigate(-1);
  const toggleLike = () => {
    setLiked(prev => !prev);
    if (disliked) setDisliked(false);
  };
  const toggleDislike = () => {
    setDisliked(prev => !prev);
    if (liked) setLiked(false);
  };

  const toggleClip = () => {
    if (!news) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return setToast({ message: '로그인이 필요합니다 🐾', type: 'error' });

    const apiUrl = clipped
      ? `http://localhost:8080/api/scrap/remove?userId=${userId}&uniqueLink=${encodeURIComponent(news.uniqueLink)}`
      : `http://localhost:8080/api/scrap/add?userId=${userId}&uniqueLink=${encodeURIComponent(news.uniqueLink)}`;

    axios
      .post(apiUrl)
      .then(() => {
        setClipped(prev => !prev);
        setToast({
          message: clipped ? '스크랩이 취소되었어요 😿' : '스크랩 완료! 😺',
          type: 'success',
        });
      })
      .catch(err => {
        console.error('스크랩 실패:', err);
        setToast({
          message: err.response?.data?.message || '스크랩에 실패했어요 😿',
          type: 'error',
        });
      });
  };

  if (!news) {
    return (
      <div className="w-full h-screen flex justify-center bg-gray-100">
        <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
          <Header title="뉴스 확대" onBack={handleBack} />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-500">뉴스를 불러오는 중이다냥...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100 relative">
      {/* ✅ 토스트 메시지 */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-md text-white text-sm font-semibold transition-all duration-500 ${
            toast.type === 'success' ? 'bg-[#6a4dff]' : 'bg-[#ff5f5f]'
          } animate-fadeIn`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="뉴스 확대" onBack={handleBack} />

        {/* ✅ 스크롤 가능한 영역 */}
        <div className="flex-1 overflow-auto relative px-5 pt-4 pb-20 mt-3">
          {/* 카테고리 라벨 */}
          <div className="absolute left-5 top-0">
            <div className="px-3 py-1 bg-[#f9f5ff] rounded-2xl">
              <div className="text-[#6840c6] text-sm font-medium">
                {news.categoryId ? tabs.find(t => t.categoryId === news.categoryId)?.label : '뉴스'}{' '}
                <span className="font-bold">{rank || 1}위</span>
              </div>
            </div>
          </div>

          {/* 제목 + 날짜 */}
          <div className="mb-4 pt-4">
            <div className="font-['Inter'] text-[24px] font-bold text-[#090a0a] tracking-wider mt-1">
              {news.title}
            </div>
            <div className="text-sm text-[#090a0a] mt-1">{news.publishedDate || ''}</div>
          </div>

          {/* 썸네일 */}
          {news.thumbnailUrl && news.thumbnailUrl !== '이미지 없음' && (
            <div className="-mx-5 mt-4">
              <img
                src={news.thumbnailUrl}
                alt="뉴스 이미지"
                className="w-full object-contain"
              />
            </div>
          )}

          {/* ✅ 간단 요약 (전체 표시, 높이 제한 없음) */}
          <div className="flex flex-row gap-3 px-4 mt-5">
            {/* 보라색 세로줄 */}
            <div className="w-[5px] bg-[#6a4dff] rounded-full self-stretch flex-shrink-0" />
            {/* 텍스트 */}
            <div className="flex flex-col gap-2 text-left">
              <p className="text-sm font-bold text-[#000]">간단 요약🔍</p>
              {news.summary ? (
                <p className="text-sm text-black px-1 text-justify leading-relaxed whitespace-pre-line">
                  {news.summary}
                </p>
              ) : (
                <p className="text-sm text-gray-500 px-1">
                  요약 준비 중입니다 😺
                </p>
              )}
            </div>
          </div>

          {/* 안내 박스 */}
          <div className="flex items-center gap-4 px-10 py-4 bg-[#cacaca]/20 rounded-xl mt-5 mb-5">
            <img src={SummaryInfoIcon} alt="요약 아이콘" className="w-6 h-6" />
            <p className="text-xs text-black leading-snug">
              동일한 주제의 뉴스 n개를 모아
              <br />
              객관적이고 중립적인 내용으로 요약합니다
            </p>
          </div>

          {/* 본문 */}
          <div
            className="text-[14px] text-[#090a0a] leading-relaxed text-justify whitespace-pre-line px-1 mt-3 mb-6"
          >
            {news.content}
          </div>

        </div>

        {/* ✅ 하단 버튼 */}
        <nav className="h-14 bg-white flex justify-around items-center border-t shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
          <button onClick={toggleLike} className="focus:outline-none">
            <img src={liked ? LikeOnIcon : LikeOffIcon} alt="좋아요" className="h-6 w-6" />
          </button>
          <button onClick={toggleClip} className="focus:outline-none">
            <img src={clipped ? ClipOnIcon : ClipOffIcon} alt="스크랩" className="h-6 w-6" />
          </button>
          <button onClick={toggleDislike} className="focus:outline-none">
            <img src={disliked ? DislikeOnIcon : DisLikeOffIcon} alt="싫어요" className="h-6 w-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}

/* ✅ CSS 애니메이션 (전역 스타일에 추가)
.fadeIn {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
*/
