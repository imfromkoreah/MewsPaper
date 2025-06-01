import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

export default function AccountInfoPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="로그인 설정" onBack={handleBack} />
        계정 정보 설정 페이지
      </div>
    </div>
  );
}
