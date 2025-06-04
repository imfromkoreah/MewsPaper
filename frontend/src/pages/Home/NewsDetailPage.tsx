import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import SummaryInfoIcon from '../../assets/svg/down_arrow.svg';
import LikeOnIcon from '../../assets/svg/like_on.svg';
import DislikeOnIcon from '../../assets/svg/dislike_on.svg';
import ClipOnIcon from '../../assets/svg/clip_on.svg';
import LikeOffIcon from '../../assets/svg/like_off.svg';
import DisLikeOffIcon from '../../assets/svg/dislike_off.svg';
import ClipOffIcon from '../../assets/svg/clip_off.svg';

export default function NewsDetailPage() {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [clipped, setClipped] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
    if (disliked) setDisliked(false);
  };

  const toggleDislike = () => {
    setDisliked((prev) => !prev);
    if (liked) setLiked(false);
  };

  const toggleClip = () => {
    setClipped((prev) => !prev);
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white overflow-hidden">
        <Header title="뉴스 확대" onBack={handleBack} />

        {/* 뉴스 본문 콘텐츠 영역 */}
        <div className="flex-1 overflow-auto">
          <div className="relative w-[375px] h-[625px] px-4 pt-4">
            {/* 헤드라인 + 날짜 */}
            <div className="mb-8">
              <div className="text-[21px] font-bold leading-loose text-[#090a0a]">
                뉴욕 허드슨강 헬기 추락... 탑승자 6명 전원 사망
              </div>
              <div className="text-sm text-[#090a0a] font-normal leading-normal">
                2025.04.11. 금요일 오전
              </div>
            </div>

            {/* 랭킹 태그 */}
            <div className="absolute left-4 top-0 mix-blend-multiply">
              <div className="px-3 py-1 bg-[#f9f5ff] rounded-2xl">
                <div className="text-[#6840c6] text-sm font-medium leading-tight">
                  세계 <span className="font-bold">1위</span>
                </div>
              </div>
            </div>

            {/* 이미지 */}
            <img
              src="https://placehold.co/375x194"
              alt="뉴스 이미지"
              className="w-[375px] h-[194px] object-cover mb-4"
            />

            {/* 간단 요약 */}
            <div className="absolute left-[34px] top-[347px] h-[72px] w-[2.28px] bg-[#e8ebed] rounded-full overflow-hidden rotate-90 origin-top-left">
              <div className="w-[2.28px] h-[7.6px] bg-[#6a4dff] rounded-full" />
              <div className="w-[2.28px] h-[76px] bg-[#6a4dff] rounded-full" />
            </div>

            <div className="absolute left-[45.68px] top-[337px] text-[11px] font-bold text-black leading-tight">
              간단 요약
            </div>

            <div className="absolute left-[58.2px] top-[363px] w-[283px] text-xs font-normal leading-tight text-black">
              탑승자들은 스페인에서 온 가족 관광객과 조종사 1명입니다. 사고 원인에 대한 조사가 진행 중이며, 유사 사고가 과거에도 발생했습니다.
            </div>

            {/* 요약 안내 박스 */}
            <div className="absolute left-[22px] top-[443px] w-[330px] px-5 py-[13px] bg-[#cacaca]/20 rounded-[10px] flex items-center gap-[30px]">
              <img
                src={SummaryInfoIcon}
                alt="요약 아이콘"
                className="w-6 h-6"
              />
              <div className="text-black text-xs font-normal leading-snug">
                동일한 주제의 뉴스 n개를 모아<br />
                객관적이고 중립적인 내용으로 요약합니다
              </div>
            </div>

            {/* 본문 */}
            <div className="absolute left-[23px] top-[523px] w-[328px] text-[#090a0a] text-sm font-normal leading-normal">
              2025년 4월 10일, 미국 뉴욕의 허드슨강 인근에서 관광용 헬기가 추락하는 사고가 발생했습니다. 이 사고로 탑승자 6명 전원이 사망하였으며, 이들은 스페인에서 온 가족 관광객과 조종사 1명으로 구성되어 있었습니다.
            </div>
          </div>
        </div>

        {/* 바텀 바 */}
        <nav className="h-14 bg-white flex justify-around items-center border-t shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
          <button onClick={toggleLike} className="focus:outline-none">
            <img
              src={liked ? LikeOnIcon : LikeOffIcon}
              alt="좋아요"
              className="h-6 w-6"
            />
          </button>

          <button onClick={toggleClip} className="focus:outline-none">
            <img
              src={clipped ? ClipOnIcon : ClipOffIcon}
              alt="스크랩"
              className="h-6 w-6"
            />
          </button>

          <button onClick={toggleDislike} className="focus:outline-none">
            <img
              src={disliked ? DislikeOnIcon : DisLikeOffIcon}
              alt="싫어요"
              className="h-6 w-6"
            />
          </button>
        </nav>
      </div>
    </div>
  );
}
