import Header from '../../components/Header'; // 경로는 프로젝트 구조에 맞게 조정하세요
import { useNavigate } from 'react-router-dom';
import Right from '../../assets/svg/right.svg';

// 아이콘 임포트
import LoginfoIcon from '../../assets/svg/loginfo.svg';
import NotiIcon from '../../assets/svg/noti.svg';
import NewsnotiIcon from '../../assets/svg/newsnoti.svg';
import ReviewIcon from '../../assets/svg/review.svg';
import InquiryIcon from '../../assets/svg/inquiry.svg';

function ListItem({ icon: Icon, text, onClick }) {
  return (
    <div className="w-full flex items-center justify-between h-14 bg-white px-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        {Icon && <img src={Icon} alt="" className="w-6 h-6" />}
        <span className="text-[#090a0a] text-base font-normal font-['Inter']">{text}</span>
      </div>
      <button
        onClick={onClick}
        className="w-6 h-6 flex items-center justify-center text-[#090a0a] hover:bg-gray-100 rounded"
        type="button"
        aria-label={`${text} 이동`}
      >
        <img src={Right} alt="" className="w-5 h-4" />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="설정" onBack={handleBack} />

        <div className="p-6 space-y-8">
          {/* 계정 섹션 */}
          <section>
            <h2 className="text-[#090a0a] text-lg font-bold font-['Inter'] mb-4">계정</h2>
            <div>
              <ListItem
                icon={LoginfoIcon}
                text="로그인 정보"
                onClick={() => navigate('/settings/account')}
              />
            </div>
          </section>

          {/* 알람 섹션 */}
          <section>
            <h2 className="text-[#090a0a] text-lg font-bold font-['Inter'] mb-4">알림</h2>
            <div>
              <ListItem
                icon={NotiIcon}
                text="알림 설정"
                onClick={() => navigate('/settings/notification')}
              />
              <ListItem
                icon={NewsnotiIcon}
                text="뉴스 알림 시간 변경"
                onClick={() => navigate('/settings/news-alert-time')}
              />
            </div>
          </section>

          {/* 앱 정보 섹션 */}
          <section>
            <h2 className="text-[#090a0a] text-lg font-bold font-['Inter'] mb-4">앱 정보</h2>
            <div>
              <ListItem
                icon={ReviewIcon}
                text="리뷰"
                onClick={() => alert('리뷰 클릭')}
              />
              <ListItem
                icon={InquiryIcon}
                text="1대1 문의"
                onClick={() => alert('1대1 문의 클릭')}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
