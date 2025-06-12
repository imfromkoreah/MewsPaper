import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/Calendar';


// 이미지 import 예시 (이미지 파일을 public 또는 assets/images 같은 폴더에 위치시켜야 함)
import profileImg from '../../assets/character/mewsdoc.png'; // 프로필 이미지
import stampIcon from '../../assets/svg/jelly_on.svg';    // 도장 아이콘

export default function Mypage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <Header title="마이페이지" onBack={handleBack} />

        <div className="w-[335px] h-[172px] relative mx-auto mt-4">
          {/* 닉네임 및 레벨 안내 */}
          <div className="w-[335px] absolute top-[142px] left-1/2 transform -translate-x-1/2 inline-flex flex-col gap-2 items-center">
            <div className="text-center text-sm text-[#090a0a] leading-tight">
              <span className="font-bold">닉네임</span>
              <span className="font-normal"> 레벨업까지 </span>
              <span className="font-bold">5개의 발바닥</span>
              <span className="font-normal">이 남았어요! </span>
              <span className="text-[20px]">🐾</span>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="absolute top-0 left-[11px] inline-flex items-center gap-[59px]">
            <div className="w-[201px] flex flex-col items-center gap-1">
              <div className="self-stretch text-base font-bold text-[#191d23]">닉네임</div>
              <div className="self-stretch px-2.5 py-0.5 bg-emerald-50 rounded">
                <div className="text-xl text-[#090a0a]">@user_name</div>
              </div>
            </div>
            <img className="w-[60px] h-[60px]" src={profileImg} alt="프로필" />
          </div>

          {/* 출석 도장, 프로필 변경 버튼 */}
          <div className="absolute top-[75px] left-[14px] inline-flex items-center gap-[17px]">
            <button
              type="button"
              className="w-[153px] px-4 py-2.5 bg-white rounded-lg shadow outline outline-1 outline-[#cfd4dc] flex items-center gap-2"
              onClick={() => {
                // 출석 도장 클릭 시 동작
                console.log('출석 도장 버튼 클릭됨');
              }}
            >
              <img className="w-[19px] h-[18px]" src={stampIcon} alt="출석 도장 아이콘" />
              <span className="text-sm text-[#344053] font-medium">출석도장 5개</span>
            </button>

            <button
              type="button"
              className="w-[142px] px-4 py-2.5 bg-[#7e56d8] rounded-lg shadow outline outline-1 outline-[#7e56d8] flex items-center justify-center"
              onClick={() => {
                // 프로필 바꾸기 클릭 시 동작
                console.log('프로필 바꾸기 버튼 클릭됨');
              }}
            >
              <span className="text-sm text-white font-medium">프로필 바꾸기</span>
            </button>
          </div>
        </div>
{/* 달력 컴포넌트 추가 */}
        <div className="mt-6 px-4">
          <Calendar />
        </div>
        
      </div>
    </div>
  );
}
