import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function LetterPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const cards = [
    {
      title: "신한證, 미국 AI 기업 '몰로코' 투자 성공!",
      body: "신한투자증권이 2021년에 투자한 몰로코에서 원금의 2.5배 넘는 수익 내고 전부 회수했대요! 몰로코 투자 대성공! 💰✨",
      img: "https://placehold.co/257x130",
    },
    {
      title: "애플, AI 기능 추가한 iOS 18 공개!",
      body: "이제 아이폰에서도 ChatGPT처럼 AI 비서를 쓸 수 있게 됐어요. 자연어로 메일도 쓰고 일정도 자동 정리!",
      img: "https://placehold.co/257x130",
    },
    {
      title: "삼성전자, 2분기 실적 서프라이즈!",
      body: "반도체 부문이 흑자 전환하며 시장 기대치 뛰어넘는 실적 발표! 주가 급등 중 📈",
      img: "https://placehold.co/257x130",
    },
    {
      title: "네이버, AI 챗봇 서비스 강화 발표!",
      body: "네이버가 자사의 AI 챗봇을 더욱 똑똑하게 업그레이드해 다양한 서비스에 적용한다고 해요.",
      img: "https://placehold.co/257x130",
    },
    {
      title: "카카오, 메타버스 플랫폼 확장 계획 발표!",
      body: "카카오가 메타버스 플랫폼에 대규모 투자를 진행하며 글로벌 시장 공략에 나선다네요.",
      img: "https://placehold.co/257x130",
    },
  ];

  // 가로 캐러셀 슬라이더 적용
  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="나만의 뉴스레터" onBack={handleBack} />

        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          {/* 카드 위 텍스트 */}
          <div className="w-[327px] text-center text-[#090a0a] text-2xl font-bold font-['Inter'] leading-loose mb-4">
            6월 11일 브리핑
          </div>

          <Swiper
            spaceBetween={8}
            slidesPerView={1.25}
            centeredSlides
            className="w-full px-1"
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index}>
                <div className="w-[320px] h-[420px] relative bg-[#e3e5e5] rounded-2xl mx-auto px-4 pt-6 flex flex-col">
                  <img
                    className="w-[257px] h-[130px] mx-auto mb-4"
                    src={card.img}
                    alt="뉴스 이미지"
                  />
                  <div className="text-center text-[#090a0a] text-sm font-bold mb-2">
                    {card.title}
                  </div>
                  <div className="text-center text-[#090a0a] text-sm leading-tight flex-grow mb-6">
                    {card.body}
                  </div>
                  <div
                    className="w-[263px] h-12 bg-[#6a4dff] rounded-[48px] flex items-center justify-center text-white text-base font-medium mx-auto"
                    style={{
                      position: 'absolute',
                      top: '330px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    스크랩하기
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 카드 아래 안내 텍스트 */}
          <div className="mt-4 text-center text-[#090a0a] text-base">
            좌우로 밀어서 넘겨보세요!
          </div>
        </div>
      </div>
    </div>
  );
}
