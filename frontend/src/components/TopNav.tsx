import { useNavigate } from 'react-router-dom';
import BellIcon from '../assets/svg/bell.svg';
import SettingIcon from '../assets/svg/setting.svg';

export default function TopNav() {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/settings');
  };

  const goToNoti = () => {
    navigate('/noti');
  };

  return (
    <div className="w-full border-t border-l border-r border-gray-200 bg-white rounded-t-md">
      <header className="w-full px-6 py-4 flex items-center justify-between">
        {/* 왼쪽 벨 아이콘 */}
        <button
          type="button"
          className="focus:outline-none"
          onClick={goToNoti}
        >
          <img src={BellIcon} alt="bell icon" className="h-6 w-6 text-gray-700" />
        </button>

        {/* 오른쪽 설정 아이콘 */}
        <button
          type="button"
          className="focus:outline-none"
          onClick={goToSettings}
        >
          <img src={SettingIcon} alt="setting icon" className="h-6 w-6 text-gray-700" />
        </button>
      </header>
    </div>
  );
}
