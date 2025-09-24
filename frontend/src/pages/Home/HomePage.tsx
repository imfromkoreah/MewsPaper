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
import PurpleDot from '../../assets/svg/check_p.svg';
import Week from '../../assets/svg/week.svg';

const HomePage = () => {
  const navigate = useNavigate();
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState({ nickname: '오는 중...' });

  const profileImages = [anchorImg1, anchorImg2, anchorImg3, anchorImg4, anchorImg5, anchorImg6];
  const [profileIndex, setProfileIndex] = useState(0);

  useEffect(() => {
    const savedIndex = localStorage.getItem('profileIndex');
    if (savedIndex !== null) {
      const idx = parseInt(savedIndex);
      if (!isNaN(idx) && idx >= 0 && idx < profileImages.length) {
        setProfileIndex(idx);
      }
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes, attendanceRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/user/${userId}`),
          axios.get(`http://localhost:8080/api/user/attendance/${userId}`)
        ]);

        setUserInfo(userRes.data);
        if (attendanceRes.data.success && attendanceRes.data.data) {
          setAttendanceDates(attendanceRes.data.data);
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[today.getDay()];
  const formattedDate = `${month.toString().padStart(2, '0')}월 ${date.toString().padStart(2, '0')}일 ${weekday}`;

  const totalDays = 7;
  const checkedInCount = attendanceDates.length;
  const userLevel = Math.floor(checkedInCount / 7) + 1;

  const attendanceIcons = Array.from({ length: totalDays }, (_, idx) =>
    idx < checkedInCount % 7 ? JellyOn : JellyOff
  );

  return (
    <div className="flex flex-col items-center space-y-10 pt-1 pb-16 px-6">
      {/* CSS 애니메이션 추가 - 투명도만 조절하여 레이아웃 영향 없음 */}
      <style>
        {`
        @keyframes shine {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.3; /* 투명도를 조절하여 반짝이는 효과 */
          }
          100% {
            opacity: 1;
          }
        }

        .shine-effect {
          animation: shine 1.5s infinite alternate; /* 1.5초 동안 무한 반복, 왔다갔다 */
        }
        `}
      </style>

      {/* 출석 박스 */}
      <div className="w-[311px] h-[198px] relative rounded-[20px] mb-6">
        <div className="w-[311px] h-[198px] left-0 top-0 absolute bg-white rounded-2xl border border-[#cacaca]/50" />

        <button
          type="button"
          className="left-[109px] top-[32px] absolute flex items-center space-x-1 text-[#090a0a] text-sm font-normal font-['Inter'] leading-none cursor-pointer
                      focus:outline-none active:scale-95 transition-transform duration-150"
          onClick={() => navigate('/home/mypage')}
        >
          <span>{formattedDate}</span>
          <img src={Week} alt="요일 옆 버튼" className="w-[10px] h-[10px]" />
        </button>

        <div className="absolute left-1/2 top-[55px] -translate-x-1/2 flex flex-col items-center max-w-fit">
          <div className="flex items-center justify-center space-x-1 whitespace-nowrap relative">
            <span className="text-[#090a0a]/30 text-lg font-bold font-['Inter'] leading-normal">
              7일 출석 미션 중
            </span>
            <span className="text-[#090a0a] text-lg font-bold font-['Inter'] leading-normal">
              {checkedInCount % 7}일 출석
            </span>
            <img src={PurpleDot} alt="출석 상태 점" className="absolute -right-6 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" />
          </div>

          <div className="flex space-x-2 mt-2">
            {attendanceIcons.map((src, idx) => (
              <img key={idx} className="w-[19.63px] h-[18px]" src={src} alt={`출석아이콘${idx + 1}`} />
            ))}
          </div>
        </div>

        <div className="w-[280px] h-px left-[16px] top-[127px] absolute bg-[#d9d9d9]" />

        <button
          type="button"
          className="w-[150px] left-[81px] top-[143px] absolute flex items-center space-x-2 cursor-pointer
                      focus:outline-none active:scale-95 transition-transform duration-150"
          onClick={() => navigate('/home/news-letter')}
        >
          {/* Message 아이콘에 shine-effect 클래스 추가 */}
          <img src={Message} alt="message" className="w-[15px] h-[10px] shine-effect" />
          <div className="flex space-x-1">
            <span className="text-[#090a0a] text-sm font-normal font-['Inter'] leading-tight">
              안 읽은 뉴스레터
            </span>
            <span className="text-[#090a0a] text-sm font-bold font-['Inter'] leading-tight">
              3개
            </span>
          </div>
        </button>
      </div>

      {/* 이미지 설명 영역 */}
      <div className="w-[321px] h-[300px] relative">
        <img
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[200px] h-auto"
          src={profileImages[profileIndex]}
          alt="대표 이미지"
        />
        <div className="absolute left-1/2 top-[330px] transform -translate-x-1/2 text-center flex items-center justify-center space-x-2">
          <div className="text-[#1c283b] text-sm font-bold font-['Noto_Sans_KR']">
            Lv. {userLevel}
          </div>
          <div className="text-[#1c283b] text-sm font-bold font-['Noto_Sans_KR']">
            {userInfo.nickname || '닉네임'}
          </div>
        </div>

        <div className="left-[260px] top-[142px] absolute text-center text-[#666666] text-[11px] font-medium font-['Inter'] leading-none [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.20)]">
          탄핵 심판의 갈림길
        </div>
        <div className="left-[0px] top-[90px] absolute text-center text-[#666666] text-[11px] font-medium font-['Inter'] leading-none [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.20)]">
          트럼프 대통령 <br />경제 정책
        </div>
        <div className="left-[255px] top-[62px] absolute text-center text-[#666666] text-[11px] font-medium font-['Inter'] leading-none [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.20)]">
          현대차에서 <br />전기차 최초공개
        </div>
      </div>
    </div>
  );
};

export default HomePage;
