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
    // ... (원래 있던 API 호출 코드 유지)
  };

  const saveNotificationsToBackend = async (selectedIndex: number) => {
    // ... (원래 있던 API 호출 코드 유지)
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
