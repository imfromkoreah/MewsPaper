import { useEffect, useState, useRef, useLayoutEffect, forwardRef } from 'react';
import MewDoc from '../../assets/character/mewsdoc.png';

interface Message {
  id: number;
  text: string;
  delay: number;
}

// 🐱 봇 프로필 + 닉네임 묶음 컴포넌트
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

// 🐱 메시지 리스트
const messages: Message[] = [
  { id: 1, text: '안냥~ 나는 너만의 앵커 냥냥박사야!', delay: 500 },
  { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
  { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
  { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
];

// 🐱 한 개의 봇 말풍선 메시지를 그리는 컴포넌트
const ChatMessage = forwardRef<
  HTMLDivElement,
  {
    text: string;
    isVisible: boolean;
    isLoading: boolean;
    topOffset: number;
    textSize: string;
  }
>(({ text, isVisible, isLoading, topOffset, textSize }, ref) => {
  return (
    <div
      ref={ref}
      className={`max-w-[280px] px-4 py-2.5 absolute left-[55px] inline-flex justify-start items-center gap-2.5 overflow-hidden bg-[#f1f1f1] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] ${
        isLoading ? 'h-10' : 'min-h-[40px]'
      }`}
      style={{ top: `${topOffset}px` }}
    >
      {isVisible ? (
        <div className={`text-[#1c283b] font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap ${textSize}`}>
          {text}
        </div>
      ) : isLoading ? (
        <LoadingDots />
      ) : null}
    </div>
  );
});

// 🗨️ 사용자 말풍선 컴포넌트
const UserChatMessage = forwardRef<
  HTMLDivElement,
  {
    text: string;
    topOffset: number;
  }
>(({ text, topOffset }, ref) => {
  return (
    <div
      ref={ref}
      className="max-w-[280px] px-4 py-2.5 absolute right-[0px] inline-flex justify-end items-center gap-2.5 overflow-hidden bg-[#6B4EFF] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] min-h-[40px]"
      style={{ top: `${topOffset}px` }}
    >
      <div className="text-white font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap text-base">
        {text}
      </div>
    </div>
  );
});



// ⏳ 로딩 애니메이션
function LoadingDots() {
  return (
    <div className="flex justify-center items-center h-full gap-1">
      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:0s]" />
      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

// 📄 ChatPage 전체
export default function ChatPage() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [textSize, setTextSize] = useState('text-base');

  const [userMessages, setUserMessages] = useState<string[]>([]);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const userMessageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [messageTops, setMessageTops] = useState<number[]>([]);
  const [userMessageTops, setUserMessageTops] = useState<number[]>([]);

  useEffect(() => {
    const showMessages = async () => {
      for (let i = 0; i < messages.length; i++) {
        setActiveIndex(i);
        await new Promise((res) => setTimeout(res, messages[i].delay));
        setVisibleMessages((prev) => [...prev, messages[i].id]);
      }
      setInputVisible(true);
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
        accHeight += 40 + gap;
      }
    }
    setMessageTops(tops);
  }, [visibleMessages, textSize]);

  useLayoutEffect(() => {
    userMessageRefs.current = userMessageRefs.current.slice(0, userMessages.length);

    const tops: number[] = [];
    const gap = 10;
    let accHeight = messageTops.length > 0 ? messageTops[messageTops.length - 1] + 60 : 200;

    for (let i = 0; i < userMessages.length; i++) {
      const el = userMessageRefs.current[i];
      if (el) {
        tops[i] = accHeight;
        accHeight += el.offsetHeight + gap;
      } else {
        tops[i] = accHeight;
        accHeight += 40 + gap;
      }
    }

    setUserMessageTops(tops);
  }, [userMessages, messageTops]);

  return (
    <main className="w-full flex justify-center">
      <div className="w-[400px] min-h-[300px] relative pb-20">
        <ChatProfile />

        {messages.map((msg, idx) => {
          const isActive = idx === activeIndex;
          const isVisible = visibleMessages.includes(msg.id);

          return isVisible || isActive ? (
            <ChatMessage
              key={msg.id}
              ref={(el) => (messageRefs.current[idx] = el)}
              topOffset={(messageTops[idx] ?? 0) + 30}
              isVisible={isVisible}
              isLoading={!isVisible && isActive}
              text={msg.text}
              textSize={textSize}
            />
          ) : null;
        })}

        {userMessages.map((msg, idx) => (
          <UserChatMessage
            key={`user-${idx}`}
            ref={(el) => (userMessageRefs.current[idx] = el)}
            text={msg}
            topOffset={(userMessageTops[idx] ?? 0) + 30}
          />
        ))}

        {inputVisible && (
          <div
            className="fixed left-1/2 transform -translate-x-1/2 w-[400px] flex items-center space-x-2"
            style={{ bottom: '70px', zIndex: 20 }}
          >
            <div className="flex-1 h-12 bg-[#e3e4e5] rounded-[100px] relative">
              <input
                type="text"
                placeholder="키워드를 입력하라냥!"
                className="w-full h-full px-5 text-base rounded-[100px] bg-white border border-[#e3e4e5] outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={`w-16 h-12 rounded-[100px] text-white transition-colors ${
                inputText.trim().length > 0
                  ? 'bg-blue-400 hover:bg-blue-500 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={inputText.trim().length === 0}
              onClick={() => {
                setUserMessages((prev) => [...prev, inputText]);
                setInputText('');
              }}
            >
              전송
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
