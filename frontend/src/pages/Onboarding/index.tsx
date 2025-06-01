import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4';

const pages: React.FC<any>[] = [Onboarding1, Onboarding2, Onboarding3, Onboarding4];

interface NotificationDataToSend {
  notificationType: string;
  notificationTime: string;
}

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const [nickname, setNickname] = useState('');
  const [showNicknameWarning, setShowNicknameWarning] = useState(false);
  const [selectedRoutineIndex, setSelectedRoutineIndex] = useState<number | null>(1);

  const navigate = useNavigate();
  const BACKEND_BASE_URL = 'http://localhost:8080';

  const allRoutines = [
    { label: '출퇴근 루틴 (AM 8:00 / PM 18:30)' },
    { label: '식후 루틴 (PM 12:30 / PM 19:30)' },
    { label: '잠자리 루틴 (AM 8:00 / PM 22:00)' },
  ];

  const handleNicknameChange = useCallback((value: string) => {
    setNickname(value);
    if (value.trim() !== '') setShowNicknameWarning(false);
  }, []);

  const handleRoutineSelectionUpdate = useCallback((index: number | null) => {
    setSelectedRoutineIndex(index);
  }, []);

const saveNicknameToBackend = async (userNickname: string) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User id not found in localStorage.");
      alert("사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.");
      navigate('/splash');
      return false;
    }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/user/update-nickname`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          nickname: userNickname
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('닉네임 저장 성공:', data.message);
        return true;
      } else {
        console.error('닉네임 저장 실패:', data.message || '알 수 없는 오류');
        alert('닉네임 저장에 실패했습니다: ' + (data.message || ''));
        return false;
      }
    } catch (error) {
      console.error('닉네임 저장 API 호출 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
      return false;
    }
  };

  const saveNotificationsToBackend = async (selectedIndex: number) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User id not found in localStorage.");
      alert("사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.");
      return false;
    }

    const selectedRoutineLabel = allRoutines[selectedIndex].label;

    const timeRegex = /\((.*?)\)/;
    const match = selectedRoutineLabel.match(timeRegex);

    let times: string[] = [];
    let notificationType: string = selectedRoutineLabel;

    if (match && match[1]) {
      const timeParts = match[1].split(' / ').map(t => t.trim());
      
      times = timeParts.map(t => {
        if (t.startsWith('AM ')) {
          return t.substring(3);
        } else if (t.startsWith('PM ')) {
          let [hourStr, minuteStr] = t.substring(3).split(':');
          let hour = parseInt(hourStr);
          if (hour !== 12) hour += 12;
          return `${String(hour).padStart(2, '0')}:${minuteStr}`;
        }
        return t;
      });

      notificationType = selectedRoutineLabel.substring(0, match.index).trim();
    }

    const notificationsToSend: NotificationDataToSend[] = times.map(time => ({
      notificationType: notificationType,
      notificationTime: time,
    }));

    if (notificationsToSend.length === 0) {
        console.warn("선택된 루틴에서 유효한 알림 시간을 파싱할 수 없습니다:", selectedRoutineLabel);
        alert("알림 설정에 문제가 발생했습니다. 다른 루틴을 선택해주세요.");
        return false;
    }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/user/save-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          notifications: notificationsToSend
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('알림 설정 저장 성공:', data.message);
        return true;
      } else {
        console.error('알림 설정 저장 실패:', data.message || '알 수 없는 오류');
        alert('알림 설정 저장에 실패했습니다: ' + (data.message || ''));
        return false;
      }
    } catch (error) {
      console.error('알림 설정 API 호출 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
      return false;
    }
  };


  const next = async () => {
    if (page === 1 && nickname.trim() === '') {
      setShowNicknameWarning(true);
      return;
    }

    if (page < pages.length - 1) {
      setPage((prev) => prev + 1);
      return;
    }

    const nicknameSaved = await saveNicknameToBackend(nickname);
    if (!nicknameSaved) return;

    if (selectedRoutineIndex === null) {
      alert('알림 루틴을 선택해주세요.');
      return;
    }

    const notificationsSaved = await saveNotificationsToBackend(selectedRoutineIndex);
    if (notificationsSaved) {
      navigate('/home');
    }
  };

  const PageComponent = pages[page];

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-between px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="flex-grow">
        {page === 1 ? (
          <Onboarding2
            onNicknameChange={handleNicknameChange}
            nickname={nickname}
            showWarning={showNicknameWarning}
          />
        ) : page === 2 ? (
          <Onboarding3
            onRoutineSelectionUpdate={handleRoutineSelectionUpdate}
            selectedRoutineIndex={selectedRoutineIndex}
          />
        ) : (
          <PageComponent />
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-10 mb-14">
        {pages.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${i === page ? 'bg-[#6a4dff]' : 'bg-gray-300'}`} />
        ))}
      </div>

      <div className="flex justify-center mb-20">
        <button
          onClick={next}
          className="font-['Inter'] w-[220px] px-8 py-4 bg-[#6a4dff] rounded-[48px] text-white text-base font-bold leading-none"
        >
          {page === pages.length - 1 ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
