// 뉴스 탭
export default function News() {
  return (
    <main className="flex-grow overflow-y-auto pt-4 pb-16 px-6">
      <div className="w-[341px] h-[93px] relative mx-auto">
        {/* 상단 타이틀 */}
        <div className="absolute left-[123px] top- text-black text-[17px] font-bold font-['Pretendard'] leading-tight">
          Top 10 뉴스
        </div>
        <div className="absolute left-[126px] top-[20px] text-black/60 text-[8px] font-normal font-['Pretendard'] leading-tight">
          22,955개 뉴스 중 Top 10
        </div>
        <div className="w-2 h-2 bg-black/30 absolute left-[214px] top-[26px]" />

        {/* 카테고리 탭 */}
        <div className="absolute top-[66px] flex justify-between w-full px-2 text-black/60 text-base font-bold font-['Pretendard'] leading-tight">
          <div className="w-7">종합</div>
          <div className="w-7">정치</div>
          <div className="w-7">경제</div>
          <div className="w-7">사회</div>
          <div className="w-[62px]">생활/문화</div>
          <div className="w-8">세계</div>
          <div className="w-8">랭킹</div>
        </div>

        {/* 탭 하이라이트 바 */}
        <div className="w-full h-1 absolute left-0 top-[89px] bg-[#e8ebed] rounded-[100px] overflow-hidden">
          <div className="w-[32.28px] h-full bg-[#6a4dff] rounded-[100px]" />
        </div>
      </div>
    </main>
  );
}
