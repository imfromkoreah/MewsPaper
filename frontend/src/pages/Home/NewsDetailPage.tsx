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

 import sampleImage from '../../assets/images/sample.jpg'; // Import the image

export default function NewsDetailPage() {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [clipped, setClipped] = useState(false);

  const handleBack = () => navigate(-1);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    if (disliked) setDisliked(false);
  };

  const toggleDislike = () => {
    setDisliked((prev) => !prev);
    if (liked) setLiked(false);
  };

  const toggleClip = () => setClipped((prev) => !prev);

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100 overflow-auto">
      {/* 스크롤은 여기서 발생 */}
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white overflow-visible">
        <Header title="뉴스 확대" onBack={handleBack} />

        <div className="flex-1 overflow-auto relative px-5 pt-4 pb-20 mt-3">
          {/* 랭킹 태그 */}
          <div className="absolute left-5 top-0">
            <div className="px-3 py-1 bg-[#f9f5ff] rounded-2xl">
              <div className="text-[#6840c6] text-sm font-medium">
                세계 <span className="font-bold">1위</span>
              </div>
            </div>
          </div>

          {/* 헤드라인 + 날짜 */}
          <div className="mb-4 pt-4">
            <div className="font-['Inter'] text-[24px] font-bold text-[#090a0a] tracking-wider mt-1">
              뉴욕 허드슨강 헬기 추락... 탑승자 6명 전원 사망
            </div>
            <div className="text-sm text-[#090a0a] mt-1">2025.04.11. 금요일 오전</div>
          </div>

          {/* 이미지 - px-5 밖으로 뺌 */}
            <div className="-mx-5 mt-4">
              <img
                src={sampleImage}
                alt="뉴스 이미지"
                className="w-full h-48 object-cover"
              />
            </div>


          {/* 간단 요약 */}
          <div className="flex gap-3 px-4 mt-4">
            {/* 세로 바 */}
            <div className="w-[8px] bg-[#6a4dff] rounded-full" />

            {/* 텍스트 박스 */}
            <div className="space-y-1">
              <p className="text-xs font-bold">간단 요약</p>
              <p className="text-xs text-black px-3">
                탑승자들은 스페인에서 온 가족 관광객과 조종사 1명입니다. 사고 원인에 대한 조사가 진행 중이며, 유사 사고가 과거에도 발생했습니다.
              </p>
            </div>
          </div>

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
          <div className="text-sm text-[#090a0a]">
            미국 뉴욕의 허드슨강에 10일(현지시간) 헬기 1대가 추락해 탑승자 6명이 모두 숨졌다.

 

AP통신 등에 따르면 이날 오후 3시17분쯤 헬기 추락 사고 신고가 접수됐으며 소방당국은 현장에서 구조작업을 벌였다. 사고 당시 헬기에는 조종사와 스페인 관광객 가족이 탑승해 있었다. 현지 경찰은 사고 현장에서 발견된 4명은 숨졌으며, 2명은 지역 병원으로 이송되었으나 사망했다고 전했다. 사고 원인에 대해서는 조사 중인 것으로 알려졌다. 해당 헬기는 약 16분간 비행한 후 강으로 추락한 것으로 CNN과 비행 추적 사이트 플라이트레이더 24는 분석했다. 

 

뉴욕 상공에서는 여러 해 동안 수 많은 항공기 사고가 발생해왔다. 앞서 2009년에는 허드슨강 상공에서 비행기와 관광용 헬기가 충돌해 9명이 숨졌고, 2018년에는 이스트강에 전세 헬기 1대가 추락해 승객 5명이 사망했다.
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
