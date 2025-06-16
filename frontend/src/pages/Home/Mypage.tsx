import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import AttendanceCalendar from '../../components/AttendanceCalendar';
import CategoryTabs from '../../components/CategoryTabs';
import ScrapNews from '../../components/ScrapNews';

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
      navigate('/login');
      return;
    }

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
    }
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
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
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div
              className="bg-white rounded-xl p-7 w-80 text-center shadow-lg font-medium"
              style={{ fontFamily: 'Pretendard, sans-serif' }}
            >
              <div className="mb-4 text-lg text-black">{popupMessage}</div>
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
