import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

export default function NotificationSettingsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="알림 설정" onBack={handleBack} />
        알림 시간 변경 페이지
      </div>
    </div>
  );
}
