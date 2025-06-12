import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import AttendanceCalendar from '../../components/AttendanceCalendar';
import CategoryTabs from '../../components/CategoryTabs';
import ScrapNews from '../../components/ScrapNews';

import profileImg from '../../assets/character/mewsdoc.png'; // 프로필 이미지
import stampIcon from '../../assets/svg/jelly_on.svg';        // 도장 아이콘

export default function MyPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'attendance' | 'scrap'>('attendance');

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="마이페이지" onBack={handleBack} />

        <div className="w-[335px] h-[172px] relative mx-auto mt-4">
          {/* 닉네임 및 레벨 안내 */}
          <div
            className="w-[335px] absolute top-[142px] left-1/2 transform -translate-x-1/2 inline-flex flex-col gap-2 items-center"
            style={{ fontFamily: 'Pretendard, sans-serif' }}
          >
            <div className="text-center text-sm text-[#090a0a] leading-tight">
              <span className="font-bold">닉네임</span>
              <span className="font-normal"> 레벨업까지 </span>
              <span className="font-bold">5개의 발바닥</span>
              <span className="font-normal">이 남았어요! </span>
              <span className="text-[20px]">🐾</span>
            </div>
          </div>

          {/* 프로필 정보 컨테이너에 relative 추가 */}
          <div className="absolute top-0 left-[11px] w-[313px] h-[60px] relative">
            {/* 텍스트 영역 - 왼쪽 정렬, 최대 너비 고정 */}
            <div className="flex flex-col items-start gap-1 max-w-[201px]">
              <div
                className="w-full text-base font-bold text-[#191d23]"
                style={{ fontFamily: 'Pretendard, sans-serif' }}
              >
                닉네임
              </div>
              <div
                className="inline-block px-2.5 py-0.5 bg-emerald-50 rounded max-w-full"
                style={{ fontFamily: 'Pretendard, sans-serif' }}
              >
                <div
                  className="text-sm text-[#090a0a] max-w-full truncate"
                  style={{ minWidth: '40px' }}
                  title="@user_name_longer_example"
                >
                  @user_name_maxxxxxxxxxm
                </div>
              </div>
            </div>

            {/* 프로필 이미지 - 절대 위치 고정 */}
            <img
              className="w-[60px] h-[60px] absolute top-0 right-0"
              src={profileImg}
              alt="프로필"
            />
          </div>

          {/* 출석 도장, 프로필 변경 버튼 */}
          <div className="absolute top-[75px] left-[14px] inline-flex items-center gap-[17px]">
            <button
              type="button"
              className="w-[153px] px-4 py-2.5 bg-white rounded-lg shadow outline outline-1 outline-[#cfd4dc] flex items-center gap-2"
              onClick={() => {
                console.log('출석 도장 버튼 클릭됨');
              }}
            >
              <img className="w-[19px] h-[18px]" src={stampIcon} alt="출석 도장 아이콘" />
              <span className="text-sm text-[#344053] font-medium">출석도장 찍기</span>
            </button>

            <button
              type="button"
              className="w-[142px] px-4 py-2.5 bg-[#7e56d8] rounded-lg shadow outline outline-1 outline-[#7e56d8] flex items-center justify-center"
              onClick={() => {
                console.log('프로필 바꾸기 버튼 클릭됨');
              }}
            >
              <span className="text-sm text-white font-medium">프로필 바꾸기</span>
            </button>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="mt-20 px-4 max-w-md mx-auto">
          <CategoryTabs selected={selectedTab} onSelect={(tab) => setSelectedTab(tab)} />
        </div>

        {/* 선택된 탭에 따른 컨텐츠 */}
        <div className="px-4 mt-0 flex-grow overflow-auto">
          {selectedTab === 'attendance' && <AttendanceCalendar />}
          {selectedTab === 'scrap' && <ScrapNews />}
        </div>
      </div>
    </div>
  );
}
