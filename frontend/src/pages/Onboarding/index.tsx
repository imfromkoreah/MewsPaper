import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4'; // Onboarding4 컴포넌트를 임포트합니다.

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
    // 새롭게 추가되는 상태: 사용자가 선택한 관심사 (preference keys)
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]); 

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

    // 새롭게 추가되는 콜백 함수: Onboarding4에서 선택된 관심사 업데이트
    const handlePreferencesUpdate = useCallback((selectedKeys: string[]) => {
        setSelectedPreferences(selectedKeys);
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

    // 새롭게 추가되는 함수: 관심사 데이터를 백엔드에 저장
    const saveUserPreferencesToBackend = async (selectedKeys: string[]) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error("User id not found in localStorage.");
            alert("사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.");
            navigate('/splash');
            return false;
        }

        if (selectedKeys.length === 0) {
            // 사용자가 관심사를 하나도 선택하지 않은 경우
            console.warn("선택된 관심사가 없습니다.");
            alert("관심사를 최소 하나 이상 선택해주세요.");
            return false;
        }

        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/user/save-preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    preferences: selectedKeys // 백엔드 DTO의 필드명과 일치
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('관심사 저장 성공:', data.message);
                return true;
            } else {
                console.error('관심사 저장 실패:', data.message || '알 수 없는 오류');
                alert('관심사 저장에 실패했습니다: ' + (data.message || ''));
                return false;
            }
        } catch (error) {
            console.error('관심사 저장 API 호출 오류:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
            return false;
        }
    };


    const next = async () => {
        // 페이지 1 (닉네임) 유효성 검사
        if (page === 1) {
            if (nickname.trim() === '') {
                setShowNicknameWarning(true);
                return;
            }
            // 닉네임은 다음 페이지로 넘어가기 전에 저장하지 않고, 최종 제출 시에만 저장하도록 유지
            // 또는 여기에서 저장하고 싶다면 아래 주석 해제
            // const nicknameSaved = await saveNicknameToBackend(nickname);
            // if (!nicknameSaved) return;
        }

        // 페이지 2 (알림 루틴) 유효성 검사
        if (page === 2) {
            if (selectedRoutineIndex === null) {
                alert('알림 루틴을 선택해주세요.');
                return;
            }
            // 알림 루틴은 다음 페이지로 넘어가기 전에 저장하지 않고, 최종 제출 시에만 저장하도록 유지
            // 또는 여기에서 저장하고 싶다면 아래 주석 해제
            // const notificationsSaved = await saveNotificationsToBackend(selectedRoutineIndex);
            // if (!notificationsSaved) return;
        }

        // 마지막 페이지가 아닌 경우 다음 페이지로 이동
        if (page < pages.length - 1) {
            setPage((prev) => prev + 1);
            return;
        }

        // --- 최종 제출 (마지막 페이지에서 '시작하기' 버튼 클릭 시) ---

        // 1. 닉네임 저장
        const nicknameSaved = await saveNicknameToBackend(nickname);
        if (!nicknameSaved) {
            // 닉네임 저장 실패 시, 사용자에게 알리고 함수 종료
            return;
        }

        // 2. 알림 설정 저장 (선택된 루틴이 있어야 함)
        if (selectedRoutineIndex === null) {
            alert('알림 루틴이 선택되지 않았습니다. 다시 확인해주세요.');
            return;
        }
        const notificationsSaved = await saveNotificationsToBackend(selectedRoutineIndex);
        if (!notificationsSaved) {
            // 알림 저장 실패 시, 사용자에게 알리고 함수 종료
            return;
        }

        // 3. 관심사 설정 저장 (selectedPreferences 상태 사용)
        // Onboarding4에서 사용자가 선택한 관심사가 selectedPreferences에 잘 담겨있어야 합니다.
        // Onboarding4 컴포넌트가 handlePreferencesUpdate 콜백을 통해 이 데이터를 상위로 전달해야 합니다.
        const preferencesSaved = await saveUserPreferencesToBackend(selectedPreferences);
        if (preferencesSaved) {
            navigate('/home'); // 모든 데이터 저장 성공 시 홈으로 이동
        }
    };

    const PageComponent = pages[page];

    return (
        <div className="w-full h-screen flex justify-center bg-gray-100">
            <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
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
                    ) : page === 3 ? ( // Onboarding4 페이지 렌더링 조건 추가
                        <Onboarding4
                            onPreferencesUpdate={handlePreferencesUpdate}
                            initialSelectedPreferences={selectedPreferences} // 초기 선택 값 전달 (선택 사항)
                        />
                    ) : (
                        <PageComponent /> // Onboarding1 (page 0) 또는 예상치 못한 페이지
                    )}
                </div>

                <div className="flex justify-center items-center gap-2 mt-10 mb-14">
                    {pages.map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${i === page ? 'bg-[#6a4dff]' : 'bg-gray-300'}`}
                        />
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
        </div>
    );
}