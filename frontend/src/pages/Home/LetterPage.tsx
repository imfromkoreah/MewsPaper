import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface NewsCard {
  title: string;
  content: string;
  thumbnailUrl?: string;
  preferenceKey: string;
  uniqueLink: string;
  categoryId: number;
  rank?: number;  // categoryId 추가
}

export default function LetterPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => navigate(-1);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    axios
      .get(`http://localhost:8080/api/newsletter/user/${userId}`)
      .then((res) => {
        // 뉴스카드별 categoryId 기준으로 정렬 후 순위 부여
        const sortedCards = res.data.map((card: NewsCard) => ({
          ...card,
          rank: 0, // 초기값
        }));

        const categoryMap: Record<number, NewsCard[]> = {};
        sortedCards.forEach((card: NewsCard) => {
          if (!categoryMap[card.categoryId]) categoryMap[card.categoryId] = [];
          categoryMap[card.categoryId].push(card);
        });

        // 카테고리별 순위 부여
        Object.values(categoryMap).forEach((arr) => {
          arr.forEach((card, idx) => {
            card.rank = idx + 1;
          });
        });

        setCards(sortedCards);
      })
      .catch((err) => console.error('뉴스레터 불러오기 실패:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center bg-gray-100">
        <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
          <Header title="나만의 뉴스레터" onBack={handleBack} />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-500">뉴스레터를 불러오는 중이다냥...</span>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <span className="text-gray-600">아직 관심 카테고리에 해당하는 뉴스가 없습니다 😿</span>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="나만의 뉴스레터" onBack={handleBack} />

        <div className="flex justify-center items-center" style={{ height: '80px' }}>
          <div className="w-[327px] text-center text-[#090a0a] text-2xl font-bold mt-24">
            오늘의 맞춤 뉴스레터
          </div>
        </div>

        <div className="mt-16 flex-1 flex flex-col items-center">
          <Swiper
            spaceBetween={28}
            slidesPerView={1.25}
            centeredSlides
            className="w-full px-1"
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index}>
                <div className="w-[320px] h-[420px] relative bg-[#e3e5e5] rounded-2xl mx-auto px-4 pt-6 flex flex-col">
                  <img
                    className="w-[257px] h-[130px] mx-auto mb-4 object-cover rounded-md"
                    src={card.thumbnailUrl || 'https://placehold.co/257x130'}
                    alt="뉴스 이미지"
                  />
                  <div className="text-center text-[#090a0a] text-sm font-bold mb-2">
                    {card.title} <span className="font-bold">{card.rank}위</span>
                  </div>
                  <div className="text-center text-[#090a0a] text-sm leading-tight mb-6 line-clamp-5">
                    {card.content}
                  </div>
                  <div
                    className="w-[263px] h-12 bg-[#6a4dff] rounded-[48px] flex items-center justify-center text-white text-base font-medium mx-auto cursor-pointer"
                    style={{
                      position: 'absolute',
                      top: '330px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                    onClick={() =>
                      navigate(
                        `/news/detail?link=${encodeURIComponent(
                          card.uniqueLink
                        )}&rank=${card.rank}` // rank 전달
                      )
                    }
                  >
                    뉴스 보기
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center text-[#090a0a] text-base mt-10">
            좌우로 밀어서 넘겨보세요!
          </div>
        </div>
      </div>
    </div>
  );
}
