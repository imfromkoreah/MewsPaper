import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import AttendanceCalendar from '../../components/AttendanceCalendar';
import CategoryTabs from '../../components/CategoryTabs';
import ScrapNews from '../../components/ScrapNews';

import profileImg from '../../assets/character/mewsdoc.png';
import stampIcon from '../../assets/svg/jelly_on.svg';

interface UserAttendanceResponse<T> { // 제네릭 타입 T를 사용하여 data 필드의 타입을 동적으로 설정
  success: boolean;
  message: string;
  data?: T; // data 필드가 있을 수도 있고 없을 수도 있음
}


export default function MyPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'attendance' | 'scrap'>('attendance');
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: '', nickname: '', email: '' });
  const [loadingStamp, setLoadingStamp] = useState(false); // 출석 도장 찍기 로딩 상태

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('로그인 정보가 존재하지 않습니다..');
      return;
    }
    axios.get(`http://localhost:8080/api/user/${userId}`)
    .then((res) => { 
      setUserInfo(res.data);
    })
    .catch((err) => { console.error('사용자 정보 불러오기 실패:', err);
    });  
    // 2. 출석 기록 불러오기
    // ⭐ userId를 사용하여 백엔드 API 호출
    
    axios.get(`http://localhost:8080/api/user/attendance/${userId}`)
    .then((res: { data: UserAttendanceResponse<string[]> }) => { // 응답 데이터 타입을 ApiResponse<string[]>로 지정
      if (res.data.success && res.data.data) {
        setAttendanceDates(res.data.data); // 출석 날짜 배열로 상태 업데이트
        console.log('출석 날짜 불러오기 성공:', res.data.data);
      } else {
        console.error('출석 날짜 불러오기 실패:', res.data.message);
      }
    })
    .catch((err) => {
      console.error('출석 날짜 불러오기 실패:', err);
      // 토큰 만료 등 인증 오류 시 로그인 페이지로 리다이렉트
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // 이미 위에서 처리했으니 중복 알림 방지
      }
    });

  }, [navigate]);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleStampClick = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('로그인이 필요합니다. 출석 도장을 찍으려면 로그인해주세요.');
      navigate('/login');
      return;
    }

    if (loadingStamp) return; // 이미 요청 중이면 중복 클릭 방지

    setLoadingStamp(true); // 로딩 시작

    try {
      // ⭐ 백엔드 출석 도장 API 엔드포인트로 요청을 보냅니다.
      // 이 URL은 실제 백엔드 API 명세에 따라 변경해야 합니다.
      const response = await fetch('http://localhost:8080/api/user/attendance', { // 백엔드 출석 API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }), // 백엔드에 사용자 ID 전송
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🎉 출석 도장 찍기 성공:', data);
        alert(data.message || '출석 도장이 성공적으로 기록되었습니다!');
        // 성공 후 UI 업데이트 (예: 버튼 비활성화, 오늘 이미 찍었음을 표시 등)
        const todayString = getTodayString();
        if (!attendanceDates.includes(todayString)) {
          setAttendanceDates(prevDates => [...prevDates, todayString]);
        }

      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || '출석 도장 찍기에 실패했습니다.';
        alert(`출석 도장 찍기 실패: ${errorMessage}`);
        console.error('출석 도장 찍기 실패:', errorData);
      }
    } catch (err) {
      console.error('출석 도장 찍기 중 네트워크 오류 발생:', err);
      alert('서버 오류: 출석 도장 찍기에 실패했습니다.');
    } finally {
      setLoadingStamp(false); // 로딩 종료
    }
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white relative">
        <Header title="마이페이지" onBack={handleBack} />

        <div className="w-[335px] h-[172px] relative mx-auto mt-4">
          {/* 닉네임 및 레벨 안내 */}
          <div
            className="w-[335px] absolute top-[142px] left-1/2 transform -translate-x-1/2 inline-flex flex-col gap-2 items-center"
            style={{ fontFamily: 'Pretendard, sans-serif' }}
          >
            <div className="text-center text-sm text-[#090a0a] leading-tight">
              <span className="font-bold">{userInfo.nickname}</span>
              <span className="font-normal"> 레벨업까지 </span>
              <span className="font-bold">5개의 발바닥</span>
              <span className="font-normal">이 남았어요! </span>
              <span className="text-[20px]">🐾</span>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="absolute top-0 left-[11px] w-[313px] h-[60px] relative">
            <div className="flex flex-col items-start gap-1 max-w-[201px]">
              <div
                className="w-full text-base font-bold text-[#191d23]"
                style={{ fontFamily: 'Pretendard, sans-serif' }}
              >
                {userInfo.nickname}
              </div>
              <div className="inline-block px-2.5 py-0.5 bg-emerald-50 rounded max-w-full" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                <div
                    className="text-sm text-[#090a0a] max-w-full truncate"
                    style={{ minWidth: '40px' }}
                    title={userInfo.email}
                  >
                    @{userInfo.email}
                  </div>
              </div>
            </div>

            <img className="w-[60px] h-[60px] absolute top-0 right-0" src={profileImg} alt="프로필" />
          </div>

          {/* 버튼 영역 */}
          <div className="absolute top-[75px] left-[14px] inline-flex items-center gap-[17px]">
            <button
              type="button"
              className={`w-[153px] px-4 py-2.5 bg-white rounded-lg shadow outline outline-1 outline-[#cfd4dc] flex items-center gap-2 ${loadingStamp ? 'cursor-not-allowed opacity-70' : ''}`}
              onClick={handleStampClick}
              disabled={loadingStamp} // 로딩 중에는 버튼 비활성화
            >
              <img className="w-[19px] h-[18px]" src={stampIcon} alt="출석 도장 아이콘" />
              <span className="text-sm text-[#344053] font-medium">
                {loadingStamp ? '처리 중...' : '출석도장 찍기'}
              </span>
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

        {/* 컨텐츠 */}
        <div className="px-4 mt-0 flex-grow overflow-auto">
          {selectedTab === 'attendance' && <AttendanceCalendar attendanceDates={attendanceDates} />}
          {selectedTab === 'scrap' && <ScrapNews />}
        </div>

        {/* 팝업 */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div
              className="bg-white rounded-xl p-7 w-80 text-center shadow-lg font-medium"
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              <div className="mb-4 text-lg text-black">오늘은 이미 출석 도장을 찍었어요! 🐾</div>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-2 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                style={{ backgroundColor: '#7F56D9', color: 'white' }}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
