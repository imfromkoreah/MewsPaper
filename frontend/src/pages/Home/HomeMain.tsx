import anchorImg from '../../assets/character/anchor.png';
import JellyOff from '../../assets/svg/jelly_off.svg';
import Message from '../../assets/svg/message.svg';
import PurpleDot from '../../assets/svg/check_p.svg';
import Week from '../../assets/svg/week.svg';

const HomeMain = () => {
  const attendanceIcons = new Array(7).fill(JellyOff);

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[today.getDay()];
  const formattedDate = `${month.toString().padStart(2, '0')}월 ${date.toString().padStart(2, '0')}일 ${weekday}`;

  return (
    <div className="flex flex-col items-center space-y-10 mt-10">
      {/* 출석 박스 */}
      <div className="w-[311px] h-[198px] relative rounded-[20px] mb-12">
        <div className="w-[311px] h-[198px] left-0 top-0 absolute bg-white rounded-2xl border border-[#cacaca]/50" />

        {/* 날짜 + 요일 아이콘 버튼 영역 */}
        <button
          type="button"
          className="left-[109px] top-[32px] absolute flex items-center space-x-1 text-[#090a0a] text-sm font-normal font-['Inter'] leading-none cursor-pointer
                    focus:outline-none active:scale-95 transition-transform duration-150"
          onClick={() => {
            // 클릭했을 때 동작 넣고 싶으면 여기 작성
            console.log('날짜 또는 아이콘 클릭됨');
          }}
        >
          <span>{formattedDate}</span>
          <img
            src={Week}
            alt="요일 옆 버튼"
            className="w-[10px] h-[10px]"
          />
        </button>



        {/* 출석 세트: 텍스트 + 완료버튼 + 아이콘 */}
        <div className="absolute left-1/2 top-[55px] -translate-x-1/2 flex flex-col items-center max-w-fit">
          <div className="flex items-center justify-center space-x-1 whitespace-nowrap relative">
            <span className="text-[#090a0a]/30 text-lg font-bold font-['Inter'] leading-normal">
              7일 출석 미션 중
            </span>
            <span className="text-[#090a0a] text-lg font-bold font-['Inter'] leading-normal">
              2일 출석
            </span>
            <img
              src={PurpleDot}
              alt="출석 상태 점"
              style={{ width: '18px', height: '18px' }} // 4.5 * 4px = 18px
              className="absolute -right-6 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* 발바닥 아이콘 */}
          <div className="flex space-x-2 mt-2">
            {attendanceIcons.map((src, idx) => (
              <img
                key={idx}
                className="w-[19.63px] h-[18px]"
                src={src}
                alt={`출석아이콘${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-[280px] h-px left-[16px] top-[127px] absolute bg-[#d9d9d9]" />

        {/* 뉴스레터 정보 클릭 영역 */}
        <button
          type="button"
          className="w-[150px] left-[81px] top-[143px] absolute flex items-center space-x-2 cursor-pointer
                    focus:outline-none active:scale-95 transition-transform duration-150"
          onClick={() => {
            console.log('뉴스레터 영역 클릭됨');
          }}
        >
          <img src={Message} alt="message" className="w-[15px] h-[10px]" />
          <div className="flex space-x-1">
            <span className="text-[#090a0a] text-sm font-normal font-['Inter'] leading-tight">
              안 읽은 뉴스레터
            </span>
            <span className="text-[#090a0a] text-sm font-bold font-['Inter'] leading-tight">
              3개
            </span>
          </div>
        </button>
      </div>

      {/* 이미지 + 설명 */}
      <div className="w-[321px] h-[300px] relative">
        <img
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[240px] h-auto"
          src={anchorImg}
          alt="대표 이미지"
        />
        <div className="left-[233px] top-[142px] absolute text-center justify-center text-[#666666] text-[11px] font-medium font-['Inter'] leading-none [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.20)]">
          탄핵 심판의 갈림길
        </div>
        <div className="left-0 top-[90px] absolute text-center justify-center text-[#666666] text-[11px] font-medium font-['Inter'] leading-none [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.20)]">
          트럼프 대통령 <br />경제 관련 어쩌구
        </div>
        <div className="left-[235px] top-[62px] absolute text-center justify-center text-[#666666] text-[11px] font-medium font-['Inter'] leading-none [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.20)]">
          현대차에서 <br />전기차 최초공개
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
