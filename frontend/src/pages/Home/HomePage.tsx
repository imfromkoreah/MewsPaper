import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import anchorImg1 from '../../assets/character/mews_anchor.png';
import anchorImg2 from '../../assets/character/mews_anchor2.png';
import anchorImg3 from '../../assets/character/mews_anchor3.png';
import anchorImg4 from '../../assets/character/mews_anchor4.png';
import anchorImg5 from '../../assets/character/mews_anchor5.png';
import anchorImg6 from '../../assets/character/mews_anchor6.png';

import JellyOff from '../../assets/svg/jelly_off.svg';
import JellyOn from '../../assets/svg/jelly_on.svg';
import Message from '../../assets/svg/message.svg';
import Week from '../../assets/svg/week.svg';

const HomePage = () => {
  const navigate = useNavigate();
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]); // 기본값 바로 사용
  const [userInfo, setUserInfo] = useState({ nickname: '사용자' });
  const [unreadNewsletterCount, setUnreadNewsletterCount] = useState(0);
  const [profileIndex, setProfileIndex] = useState(0);

  const profileImages = [anchorImg1, anchorImg2, anchorImg3, anchorImg4, anchorImg5, anchorImg6];

  /** ✅ 이미지 프리로딩 */
  useEffect(() => {
    profileImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /** ✅ 로컬스토리지 프로필 인덱스 */
  useEffect(() => {
    const savedIndex = localStorage.getItem('profileIndex');
    if (savedIndex !== null) {
      const idx = parseInt(savedIndex);
      if (!isNaN(idx) && idx >= 0 && idx < profileImages.length) {
        setProfileIndex(idx);
      }
    }
  }, []);

  /** ✅ 데이터 요청 (비동기로만 실행 — 렌더 블로킹 없음) */
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/user/${userId}`)
      .then((res) => setUserInfo(res.data))
      .catch(console.error);

    axios
      .get(`http://localhost:8080/api/user/attendance/${userId}`)
      .then((res) => {
        if (res.data.success && res.data.data) setAttendanceDates(res.data.data);
      })
      .catch(console.error);

    axios
      .get(`http://localhost:8080/api/newsletter/user/${userId}`)
      .then((res) => {
        const unread = res.data?.filter((c: any) => !c.read)?.length || 0;
        setUnreadNewsletterCount(unread);
      })
      .catch(console.error);
  }, []);

  /** ✅ 날짜 및 진행률 계산 */
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[today.getDay()];
  const formattedDate = `${month}월 ${date}일 ${weekday}요일`;

  const totalDays = 7;
  const checkedInCount = attendanceDates.length;
  const userLevel = Math.floor(checkedInCount / 7) + 1;
  const progressPercent = (checkedInCount % 7) * (100 / 7);
  const attendanceIcons = Array.from({ length: totalDays }, (_, idx) =>
    idx < checkedInCount % 7 ? JellyOn : JellyOff
  );

  /** ✅ 즉시 렌더 + 데이터 교체 구조 */
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-white pt-10 pb-24 px-6 animate-fadeIn">

      {/* 출석 박스 */}
      <div
        className="w-[320px] h-[220px] relative rounded-[28px] bg-white 
                   shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#f2f2f2] 
                   transition-all duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] 
                   active:scale-[0.99]"
      >
        {/* 날짜 */}
        <div className="flex justify-center items-center mt-5">
          <button
            type="button"
            className="flex items-center space-x-1 text-[#222] text-sm font-semibold
                       bg-[#fafafa] hover:bg-[#f3f3f3] active:bg-[#ededed]
                       px-3 py-1 rounded-full transition-all duration-150 shadow-sm
                       active:scale-95"
            onClick={() => navigate('/home/mypage')}
          >
            <span>{formattedDate}</span>
            <img src={Week} alt="요일" className="w-[10px] h-[10px] opacity-70" />
          </button>
        </div>

        {/* 출석 정보 */}
        <div className="flex flex-col items-center mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-base font-medium">일일 출석 미션</span>
            <span className="text-[#111] text-base font-bold">{checkedInCount % 7}일째</span>
          </div>

          {/* 젤리 아이콘 */}
          <div className="flex justify-center space-x-2 mt-1">
            {attendanceIcons.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`출석${idx + 1}`}
                loading="lazy"
                className="w-[19px] h-[18px] transition-transform hover:scale-110"
              />
            ))}
          </div>
        </div>

        <div className="w-[280px] h-px mx-auto mt-5 bg-[#e9e9e9]" />

        {/* 뉴스레터 버튼 */}
        <button
          type="button"
          className="absolute left-1/2 bottom-7 -translate-x-1/2 
                    flex items-center justify-center gap-2 
                    bg-white hover:bg-[#f7f7f7] active:bg-[#ececec] 
                    px-5 py-2 rounded-xl shadow-sm 
                    hover:shadow-md active:scale-95 
                    transition-all duration-150 
                    w-auto whitespace-nowrap"
          onClick={() => navigate('/home/news-letter')}
        >
          <img
            src={Message}
            alt="메시지"
            className="w-[15px] h-[10px] opacity-80 transition-transform hover:scale-110"
          />
          <span className="text-[#1a1a1a] text-sm font-bold select-none">
            안 읽은 뉴스레터 {unreadNewsletterCount}개
          </span>
        </button>
      </div>

      {/* 캐릭터 영역 */}
      <div className="relative flex flex-col items-center mt-8">
        <img
          src={profileImages[profileIndex]}
          alt="대표 이미지"
          className="w-[170px] h-auto animate-float hover:animate-wiggle cursor-pointer
                     drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-transform"
        />

        {/* 반짝이 효과 */}
        <div className="absolute -top-4 right-10 w-6 h-6 bg-[#d6ccff]/70 rounded-full animate-ping"></div>
        <div className="absolute top-8 -left-8 w-5 h-5 bg-[#c4b8ff]/60 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-0 right-14 w-7 h-7 bg-[#e1d8ff]/70 rounded-full animate-ping delay-700"></div>

        {/* 캐릭터 정보 */}
        <div className="mt-4 flex flex-col items-center text-[#1c283b] font-bold text-center">
          <div className="text-sm opacity-80">Lv. {userLevel} {userInfo.nickname}</div>

          <div className="relative mt-2">
            <div className="bg-[#f7f5ff] text-[#5b4df2] text-sm font-medium px-4 py-2 rounded-2xl shadow-sm">
              오늘은 좀 더 똑똑해진 기분이야 💪
            </div>
            <div className="absolute left-1/2 -bottom-2 w-0 h-0 -translate-x-1/2 
                            border-l-[6px] border-r-[6px] border-t-[6px] 
                            border-transparent border-t-[#f7f5ff]" />
          </div>

          {/* 경험치 바 */}
          <div className="w-[200px] h-[8px] bg-[#ececec] rounded-full mt-5 overflow-hidden relative">
            <div
              className="absolute left-0 top-0 h-full 
                         bg-gradient-to-r from-[#a58cff] via-[#d3c8ff] to-[#5b4df2]
                         bg-[length:200%_100%] animate-shine
                         rounded-full shadow-[inset_0_0_6px_rgba(255,255,255,0.6)]
                         transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {(checkedInCount % 7)}/7 EXP
          </span>
        </div>
      </div>

      {/* 애니메이션 */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .animate-float {
            animation: float 3.5s ease-in-out infinite;
          }

          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            75% { transform: rotate(-3deg); }
          }
          .animate-wiggle {
            animation: wiggle 0.4s ease-in-out;
          }

          @keyframes shine {
            0% { background-position: 0% 0%; }
            100% { background-position: -200% 0%; }
          }
          .animate-shine {
            animation: shine 2s linear infinite;
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
