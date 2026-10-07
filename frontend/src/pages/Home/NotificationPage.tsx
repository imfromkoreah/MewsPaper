import Header from '../../components/Header'; // 경로는 프로젝트 구조에 맞게 조정하세요
import { useNavigate } from 'react-router-dom';

export default function NotificationPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
      <Header title="알림" onBack={handleBack} />
      {/* 페이지 내용 여기에 추가 */}
    </div>
    </div>
  );
}
