import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';

import SummaryInfoIcon from '../../assets/svg/down_arrow.svg';
import LikeOnIcon from '../../assets/svg/like_on.svg';
import DislikeOnIcon from '../../assets/svg/dislike_on.svg';
import ClipOnIcon from '../../assets/svg/clip_on.svg';
import LikeOffIcon from '../../assets/svg/like_off.svg';
import DisLikeOffIcon from '../../assets/svg/dislike_off.svg';
import ClipOffIcon from '../../assets/svg/clip_off.svg';

export default function NewsDetailPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const link = queryParams.get('link');
  const navigate = useNavigate();

  const [news, setNews] = useState<any | null>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [clipped, setClipped] = useState(false);

  const tabs = [
    { id: 'politics', label: '정치', categoryId: 100 },
    { id: 'economy', label: '경제', categoryId: 101 },
    { id: 'society', label: '사회', categoryId: 102 },
    { id: 'culture', label: '생활/문화', categoryId: 103 },
    { id: 'world', label: '세계', categoryId: 104 },
    { id: 'it', label: 'IT/과학', categoryId: 105 },
  ];

  useEffect(() => {
    if (!link) return;

    axios
      .get(`http://localhost:8080/api/news/detail?link=${encodeURIComponent(link)}`)
      .then(res => setNews(res.data))
      .catch(err => console.error('뉴스 상세 조회 실패:', err));
  }, [link]);

  const handleBack = () => navigate(-1);
  const toggleLike = () => { setLiked(prev => !prev); if (disliked) setDisliked(false); };
  const toggleDislike = () => { setDisliked(prev => !prev); if (liked) setLiked(false); };
  const toggleClip = () => setClipped(prev => !prev);

  // 로딩 상태: 화면 구조 유지, 중앙에 로딩 메시지
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
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="뉴스 확대" onBack={handleBack} />

        <div className="flex-1 overflow-auto relative px-5 pt-4 pb-20 mt-3">
          {/* 랭킹 태그 */}
          <div className="absolute left-5 top-0">
            <div className="px-3 py-1 bg-[#f9f5ff] rounded-2xl">
              <div className="text-[#6840c6] text-sm font-medium">
                {news.categoryId ? tabs.find(t => t.categoryId === news.categoryId)?.label : '뉴스'} <span className="font-bold">1위</span>
              </div>
            </div>
          </div>

          {/* 헤드라인 + 날짜 */}
          <div className="mb-4 pt-4">
            <div className="font-['Inter'] text-[24px] font-bold text-[#090a0a] tracking-wider mt-1">
              {news.title}
            </div>
            <div className="text-sm text-[#090a0a] mt-1">{news.publishedDate || ''}</div>
          </div>

          {/* 이미지 */}
          {news.thumbnailUrl && (
            <div className="-mx-5 mt-4">
              <img
                src={news.thumbnailUrl}
                alt="뉴스 이미지"
                className="w-full max-h-[400px] object-contain"
              />
            </div>
          )}

          {/* 간단 요약 */}
          {news.content && (
            <div className="flex gap-3 px-4 mt-4">
              <div className="w-[8px] bg-[#6a4dff] rounded-full" />
              <div className="space-y-1">
                <p className="text-xs font-bold">간단 요약</p>
                <p className="text-xs text-black px-3 line-clamp-3">
                  {news.content}
                </p>
              </div>
            </div>
          )}

          {/* 요약 안내 박스 */}
          <div className="flex items-center gap-4 px-10 py-4 bg-[#cacaca]/20 rounded-xl mt-5 mb-5">
            <img src={SummaryInfoIcon} alt="요약 아이콘" className="w-6 h-6" />
            <p className="text-xs text-black leading-snug">
              동일한 주제의 뉴스 n개를 모아
              <br />
              객관적이고 중립적인 내용으로 요약합니다
            </p>
          </div>

          {/* 본문 */}
          <div className="text-sm text-[#090a0a] whitespace-pre-line">
            {news.content}
          </div>
        </div>

        {/* 바텀 바 */}
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
