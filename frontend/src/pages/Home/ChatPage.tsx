import { useEffect, useState, useRef, useLayoutEffect, forwardRef } from 'react';
import MewDoc from '../../assets/character/mewsdoc.png';

interface Message {
  id: number;
  text: string;
  delay: number; // 보여주기 전 대기 시간(ms)
}

const messages: Message[] = [
  { id: 1, text: '안냥~ 나는 너만의 앵커 냥냥박사야!', delay: 500 },
  { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
  { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
  { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
];

// 프로필 + 프로필 네임 묶음 컴포넌트
function ChatProfile() {
  return (
    <>
      <div
        className="absolute left-[51px] top-[2px] text-black text-[13px] font-bold font-['Noto_Sans_KR']"
        style={{ zIndex: 10 }}
      >
        냥냥박사
      </div>
      <div
        className="w-10 h-10 bg-blue-50 rounded-full absolute left-[4px] top-[4px]"
        style={{ zIndex: 10 }}
      />
      <img
        className="w-12 h-12 absolute left-0 top-0"
        src={MewDoc}
        alt="냥냥박사 프로필"
        style={{ zIndex: 10 }}
      />
    </>
  );
}

const ChatMessage = forwardRef<
  HTMLDivElement,
  {
    text: string;
    isVisible: boolean;
    isLoading: boolean;
    topOffset: number;
  }
>(({ text, isVisible, isLoading, topOffset }, ref) => {
  return (
    <div
      ref={ref}
      className={`max-w-[250px] px-4 py-2.5 absolute left-[51px] inline-flex justify-start items-center gap-2.5 overflow-hidden bg-[#f1f1f1] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] ${
        isLoading ? 'h-10' : 'min-h-[40px]'
      }`}
      style={{ top: `${topOffset}px` }}
    >
      {isVisible ? (
        <div className="text-[#1c283b] text-sm font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap">
          {text}
        </div>
      ) : isLoading ? (
        <LoadingDots />
      ) : null}
    </div>
  );
});

function LoadingDots() {
  return (
    <div className="flex justify-center items-center h-full gap-1">
      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:0s]" />
      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

export default function ChatPage() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [messageTops, setMessageTops] = useState<number[]>([]);

  useEffect(() => {
    const showMessages = async () => {
      for (let i = 0; i < messages.length; i++) {
        setActiveIndex(i);
        await new Promise((res) => setTimeout(res, messages[i].delay));
        setVisibleMessages((prev) => [...prev, messages[i].id]);
      }
    };
    showMessages();
  }, []);

  useLayoutEffect(() => {
    messageRefs.current = messageRefs.current.slice(0, messages.length);

    const tops: number[] = [];
    const gap = 10;
    let accHeight = 0;

    for (let i = 0; i < messages.length; i++) {
      const el = messageRefs.current[i];
      if (el) {
        tops[i] = accHeight;
        accHeight += el.offsetHeight + gap;
      } else {
        tops[i] = accHeight;
        accHeight += 40 + gap; // 기본 예상 높이
      }
    }
    setMessageTops(tops);
  }, [visibleMessages]);

  return (
    <main>
      <div className="w-[301px] h-[250px] relative">
        <ChatProfile />

        {messages.map((msg, idx) => {
          const isActive = idx === activeIndex;
          const isVisible = visibleMessages.includes(msg.id);

          return isVisible || isActive ? (
            <ChatMessage
              key={msg.id}
              ref={(el) => (messageRefs.current[idx] = el)}
              topOffset={(messageTops[idx] ?? 0) + 30} // 30px 하단 여백
              isVisible={isVisible}
              isLoading={!isVisible && isActive}
              text={msg.text}
            />
          ) : null;
        })}
      </div>
    </main>
  );
}
