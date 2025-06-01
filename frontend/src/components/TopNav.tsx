import { useNavigate } from 'react-router-dom';
import BellIcon from '../assets/svg/bell.svg';
import SettingIcon from '../assets/svg/setting.svg';

export default function TopNav() {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/settings'); // 설정 페이지로 이동
  };

  const goToNoti = () => {
    navigate('/noti'); // 알림 페이지로 이동
  };

  return (
    <header className="w-full bg-white px-4 py-3 flex items-center justify-between">
      
      {/* 왼쪽 벨 아이콘 (버튼으로 클릭 가능) */}
      <button
        type="button"
        className="focus:outline-none"
        onClick={goToNoti}
      >
        <img src={BellIcon} alt="bell icon" className="h-6 w-6 text-gray-700" />
      </button>

      {/* 오른쪽 설정 아이콘 (버튼으로 클릭 가능) */}
      <button
        type="button"
        className="focus:outline-none"
        onClick={goToSettings}
      >
        <img src={SettingIcon} alt="setting icon" className="h-6 w-6 text-gray-700" />
      </button>
      
    </header>
  );
}
