import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======

>>>>>>> 50eeb761c2ed73880a8fcdf3f5d0f271407532e7
import Header from '../../components/Header';
import AttendanceCalendar from '../../components/AttendanceCalendar';
import CategoryTabs from '../../components/CategoryTabs';
import ScrapNews from '../../components/ScrapNews';

<<<<<<< HEAD
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
  const token = localStorage.getItem('userToken');
  if (!token) {
    console.error('토큰이 없습니다. 로그인 상태를 확인하세요.');
    return;
  }
    axios.get('http://localhost:8080/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,  // 이 부분 추가!
      },
      withCredentials: true,  // 세션/쿠키가 필요하다면 유지
    })
    .then((res) => { setUserInfo(res.data);
    })
    .catch((err) => { console.error('사용자 정보 불러오기 실패:', err);
    });  
    // 2. 출석 기록 불러오기
    // ⭐ userId를 사용하여 백엔드 API 호출
    
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:8080/api/user/attendance/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 토큰 포함
      },
      withCredentials: true,
    })
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
=======
import profileImg1 from '../../assets/character/mewsdoc.png';
import profileImg2 from '../../assets/character/mewsdoc2.png';
import profileImg3 from '../../assets/character/mewsdoc3.png';
import profileImg4 from '../../assets/character/mewsdoc4.png';
import profileImg5 from '../../assets/character/mewsdoc5.png';
import profileImg6 from '../../assets/character/mewsdoc6.png';

import stampIcon from '../../assets/svg/jelly_on.svg';

const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4, profileImg5, profileImg6];

export default function MyPage() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<'attendance' | 'scrap'>('attendance');
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState({ id: '', nickname: '', email: '' });

  const [loadingStamp, setLoadingStamp] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNicknameEditPopup, setShowNicknameEditPopup] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [selectedProfileIndex, setSelectedProfileIndex] = useState(() => {
    const savedIndex = localStorage.getItem('profileIndex');
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const handleBack = () => navigate(-1);
  const getTodayString = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return console.error('로그인 정보가 존재하지 않습니다.');

      try {
        const userRes = await axios.get(`http://localhost:8080/api/user/${userId}`);
        setUserInfo(userRes.data);
        localStorage.setItem('nickname', userRes.data.nickname);

        const attendanceRes = await axios.get(`http://localhost:8080/api/user/attendance/${userId}`);
        if (attendanceRes.data.success && attendanceRes.data.data) {
          setAttendanceDates(attendanceRes.data.data);
        } else {
          console.error('출석 날짜 불러오기 실패:', attendanceRes.data.message);
        }
      } catch (err) {
        console.error('데이터 불러오기 실패:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleStampClick = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setPopupMessage('로그인이 필요합니다.');
      setShowPopup(true);
>>>>>>> 50eeb761c2ed73880a8fcdf3f5d0f271407532e7
      navigate('/login');
      return;
    }

<<<<<<< HEAD
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
=======
    if (loadingStamp) return;
    setLoadingStamp(true);

    try {
      const res = await fetch('http://localhost:8080/api/user/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        const today = getTodayString();
        if (!attendanceDates.includes(today)) {
          setAttendanceDates((prev) => [...prev, today]);
          setPopupMessage(data.message || '출석 도장이 성공적으로 기록되었습니다! 🐾');
        } else {
          setPopupMessage('오늘은 이미 출석 도장을 찍었어요! 🐾');
        }
      } else {
        setPopupMessage(`출석 실패: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage('서버 오류로 출석에 실패했습니다.');
    } finally {
      setShowPopup(true);
      setLoadingStamp(false);
    }
  };

  const handleNicknameEdit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !newNickname.trim()) {
      setPopupMessage('닉네임을 입력해주세요.');
      setShowPopup(true);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/user/update-nickname', {
        id: userId,
        nickname: newNickname,
      });

      if (res.data.success) {
        setUserInfo((prev) => ({ ...prev, nickname: newNickname }));
        localStorage.setItem('nickname', newNickname);
        setShowNicknameEditPopup(false);
      } else {
        setPopupMessage('닉네임 변경 실패: ' + res.data.message);
        setShowPopup(true);
      }
    } catch (err) {
      console.error('닉네임 변경 오류:', err);
      setPopupMessage('서버 오류로 닉네임 변경에 실패했습니다.');
      setShowPopup(true);
>>>>>>> 50eeb761c2ed73880a8fcdf3f5d0f271407532e7
    }
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
<<<<<<< HEAD
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white relative">
        <Header title="마이페이지" onBack={handleBack} />

        <div className="w-[335px] h-[172px] relative mx-auto mt-4">
=======
      <div className="w-full max-w-md h-full flex flex-col bg-white border shadow-sm rounded relative">
        <Header title="마이페이지" onBack={handleBack} />

        {/* 유저 정보 영역 */}
        <div className="relative w-[335px] h-[172px] mx-auto mt-4">
          <div className="absolute top-0 left-[11px] w-[313px] h-[60px] flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="text-base font-bold flex items-center gap-2">
                {userInfo.nickname}
                <button
                  className="text-xs text-purple-600 underline"
                  onClick={() => {
                    setNewNickname(userInfo.nickname);
                    setShowNicknameEditPopup(true);
                  }}
                >
                  수정
                </button>
              </div>
              <div className="px-2.5 py-0.5 bg-emerald-50 rounded text-sm text-[#090a0a] truncate max-w-[200px]">
                @{userInfo.email}
              </div>
            </div>
            <img
              src={profileImages[selectedProfileIndex]}
              alt="프로필"
              className="w-[60px] h-[60px]"
            />
          </div>

>>>>>>> 50eeb761c2ed73880a8fcdf3f5d0f271407532e7
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

<<<<<<< HEAD
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
=======
          {/* 버튼 */}
          <div className="absolute top-[75px] left-[14px] flex gap-[17px]">
            <button
              className={`w-[153px] px-4 py-2.5 bg-white rounded-lg shadow outline outline-1 outline-[#cfd4dc] flex items-center gap-2 ${
                loadingStamp ? 'cursor-not-allowed opacity-70' : ''
              }`}
              onClick={handleStampClick}
              disabled={loadingStamp}
            >
              <img src={stampIcon} alt="도장" className="w-[19px] h-[18px]" />
              <span className="text-sm font-medium">{loadingStamp ? '처리 중...' : '출석도장 찍기'}</span>
            </button>
            <button
              className="w-[142px] px-4 py-2.5 bg-[#7e56d8] text-white rounded-lg shadow"
              onClick={() => setShowProfilePopup(true)}
            >
              프로필 바꾸기
            </button>
          </div>
        </div>

        {/* 탭 및 콘텐츠 */}
        <div className="mt-20 px-4">
          <CategoryTabs selected={selectedTab} onSelect={setSelectedTab} />
        </div>
        <div className="px-4 flex-grow overflow-auto">
          {selectedTab === 'attendance' ? (
            <AttendanceCalendar attendanceDates={attendanceDates} />
          ) : (
            <ScrapNews />
          )}
        </div>

        {/* 프로필 변경 팝업 */}
        {showProfilePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
              <h3 className="text-lg font-semibold mb-4">프로필을 선택하세요</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {profileImages.map((img, index) => (
                  <div
                    key={index}
                    className={`w-24 h-24 border-4 flex items-center justify-center cursor-pointer overflow-hidden ${
                      selectedProfileIndex === index ? 'border-purple-500' : 'border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedProfileIndex(index);
                      localStorage.setItem('profileIndex', String(index));
                      setShowProfilePopup(false);
                    }}
                  >
                    <img src={img} alt={`프로필 ${index + 1}`} className="object-contain w-full h-full" />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowProfilePopup(false)}
                className="mt-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 닉네임 수정 팝업 */}
        {showNicknameEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
              <h3 className="text-lg font-semibold mb-4">닉네임 수정</h3>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowNicknameEditPopup(false)}
                  className="flex-1 py-2 rounded bg-gray-300 hover:bg-gray-400 text-white"
                >
                  취소
                </button>
                <button
                  onClick={handleNicknameEdit}
                  className="flex-1 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 커스텀 팝업 */}
>>>>>>> 50eeb761c2ed73880a8fcdf3f5d0f271407532e7
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div
              className="bg-white rounded-xl p-7 w-80 text-center shadow-lg font-medium"
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
<<<<<<< HEAD
              <div className="mb-4 text-lg text-black">오늘은 이미 출석 도장을 찍었어요! 🐾</div>
=======
              <div className="mb-4 text-lg text-black">{popupMessage}</div>
>>>>>>> 50eeb761c2ed73880a8fcdf3f5d0f271407532e7
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
