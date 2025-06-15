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

import stampIcon from '../../assets/svg/jelly_on.svg';

interface UserAttendanceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export default function MyPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'attendance' | 'scrap'>('attendance');
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: '', nickname: '', email: '' });
  const [loadingStamp, setLoadingStamp] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const [showNicknameEditPopup, setShowNicknameEditPopup] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4];
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(() => {
    const savedIndex = localStorage.getItem('profileIndex');
    return savedIndex !== null ? parseInt(savedIndex) : 0;
  });

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('로그인 정보가 존재하지 않습니다.');
      return;
    }

    axios
      .get(`http://localhost:8080/api/user/${userId}`)
      .then((res) => {
        setUserInfo(res.data);
        localStorage.setItem('nickname', res.data.nickname);  // 추가!
      })
      .catch((err) => {
        console.error('사용자 정보 불러오기 실패:', err);
      });

    axios
      .get(`http://localhost:8080/api/user/attendance/${userId}`)
      .then((res: { data: UserAttendanceResponse<string[]> }) => {
        if (res.data.success && res.data.data) {
          setAttendanceDates(res.data.data);
        } else {
          console.error('출석 날짜 불러오기 실패:', res.data.message);
        }
      })
      .catch((err) => {
        console.error('출석 날짜 불러오기 실패:', err);
      });
  }, [navigate]);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleStampClick = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (loadingStamp) return;
    setLoadingStamp(true);

    try {
      const response = await fetch('http://localhost:8080/api/user/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || '출석 도장이 성공적으로 기록되었습니다!');
        const todayString = getTodayString();
        if (!attendanceDates.includes(todayString)) {
          setAttendanceDates((prev) => [...prev, todayString]);
        }
      } else {
        const errorData = await response.json();
        alert(`출석 도장 찍기 실패: ${errorData.message}`);
      }
    } catch (err) {
      alert('서버 오류: 출석 도장 찍기에 실패했습니다.');
      console.error(err);
    } finally {
      setLoadingStamp(false);
    }
  };

  const handleNicknameEdit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    if (!newNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/user/${userId}/nickname`, {
        nickname: newNickname,
      });

      if (response.data.success) {
        setUserInfo((prev) => ({ ...prev, nickname: newNickname }));
        localStorage.setItem('nickname', newNickname);  // 추가!
        setShowNicknameEditPopup(false);
      } else {
        alert('닉네임 변경 실패: ' + response.data.message);
      }
    } catch (err) {
      console.error('닉네임 변경 오류:', err);
      alert('서버 오류로 닉네임 변경에 실패했습니다.');
    }
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white relative">
        <Header title="마이페이지" onBack={handleBack} />

        <div className="w-[335px] h-[172px] relative mx-auto mt-4">
          <div className="absolute top-0 left-[11px] w-[313px] h-[60px] relative">
            <div className="flex flex-col items-start gap-1 max-w-[201px]">
              <div className="w-full text-base font-bold text-[#191d23] flex items-center gap-2">
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
              <div className="inline-block px-2.5 py-0.5 bg-emerald-50 rounded max-w-full">
                <div className="text-sm text-[#090a0a] max-w-full truncate" title={userInfo.email}>
                  @{userInfo.email}
                </div>
              </div>
            </div>
            <img
              className="w-[60px] h-[60px] absolute top-0 right-0"
              src={profileImages[selectedProfileIndex]}
              alt="프로필"
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

          <div className="absolute top-[75px] left-[14px] inline-flex items-center gap-[17px]">
            <button
              type="button"
              className={`w-[153px] px-4 py-2.5 bg-white rounded-lg shadow outline outline-1 outline-[#cfd4dc] flex items-center gap-2 ${
                loadingStamp ? 'cursor-not-allowed opacity-70' : ''
              }`}
              onClick={handleStampClick}
              disabled={loadingStamp}
            >
              <img className="w-[19px] h-[18px]" src={stampIcon} alt="출석 도장 아이콘" />
              <span className="text-sm text-[#344053] font-medium">
                {loadingStamp ? '처리 중...' : '출석도장 찍기'}
              </span>
            </button>

            <button
              type="button"
              className="w-[142px] px-4 py-2.5 bg-[#7e56d8] rounded-lg shadow outline outline-1 outline-[#7e56d8] flex items-center justify-center"
              onClick={() => setShowProfilePopup(true)}
            >
              <span className="text-sm text-white font-medium">프로필 바꾸기</span>
            </button>
          </div>
        </div>

        <div className="mt-20 px-4 max-w-md mx-auto">
          <CategoryTabs selected={selectedTab} onSelect={(tab) => setSelectedTab(tab)} />
        </div>

        <div className="px-4 mt-0 flex-grow overflow-auto">
          {selectedTab === 'attendance' && <AttendanceCalendar attendanceDates={attendanceDates} />}
          {selectedTab === 'scrap' && <ScrapNews />}
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl p-7 w-80 text-center shadow-lg font-medium">
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

{showProfilePopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
    <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg font-medium">
      <h3 className="text-lg font-semibold mb-4">프로필을 선택하세요</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {profileImages.map((img, index) => (
          <div
            key={index}
            className={`w-24 h-24 border-4 cursor-pointer flex items-center justify-center overflow-hidden ${
              selectedProfileIndex === index ? 'border-purple-500' : 'border-transparent'
            }`}
            onClick={() => {
              setSelectedProfileIndex(index);
              localStorage.setItem('profileIndex', String(index));
              setShowProfilePopup(false);
            }}
          >
            <img
              src={img}
              alt={`프로필 ${index + 1}`}
              className="object-contain w-full h-full"
            />
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


        {showNicknameEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg font-medium">
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
      </div>
    </div>
  );
}
