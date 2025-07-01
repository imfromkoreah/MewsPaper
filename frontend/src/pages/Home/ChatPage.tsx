import { useEffect, useState, useRef, useLayoutEffect, forwardRef } from 'react';

import profileImg1 from '../../assets/character/mewsdoc.png';
import profileImg2 from '../../assets/character/mewsdoc2.png';
import profileImg3 from '../../assets/character/mewsdoc3.png';
import profileImg4 from '../../assets/character/mewsdoc4.png';
import profileImg5 from '../../assets/character/mewsdoc5.png';
import profileImg6 from '../../assets/character/mewsdoc6.png';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  delay: number;
}

interface ChatMessageProps {
  text: string;
  isVisible: boolean;
  isLoading: boolean;
  topOffset: number;
  textSize: string;
}
const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ text, isVisible, isLoading, topOffset, textSize }, ref) => (
    <div
      ref={ref}
      className={`max-w-[260px] px-4 py-2.5 absolute left-[55px] inline-flex items-center gap-2.5 overflow-hidden bg-[#f1f1f1] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] ${
        isLoading ? 'h-10' : 'min-h-[40px]'
      }`}
      style={{ top: topOffset }}
    >
      {isVisible ? (
        <div
          className={`text-[#1c283b] text-base font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap ${textSize}`}
        >
          {text}
        </div>
      ) : isLoading ? (
        <LoadingDots />
      ) : null}
    </div>
  )
);
ChatMessage.displayName = 'ChatMessage';

interface UserChatMessageProps {
  text: string;
  topOffset: number;
}
const UserChatMessage = forwardRef<HTMLDivElement, UserChatMessageProps>(({ text, topOffset }, ref) => (
  <div
    ref={ref}
    className="max-w-[260px] px-4 py-2.5 absolute right-0 inline-flex justify-end items-center gap-2.5 overflow-hidden bg-[#6B4EFF] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] min-h-[40px]"
    style={{ top: topOffset }}
  >
    <div className="text-white font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap text-base">{text}</div>
  </div>
));
UserChatMessage.displayName = 'UserChatMessage';

function LoadingDots() {
  return (
    <div className="flex justify-center items-center h-full gap-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

export default function ChatPage() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [textSize] = useState('text-base');
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [extraBotVisible, setExtraBotVisible] = useState(false);
  const [showFinalBotMessage, setShowFinalBotMessage] = useState(false);
  const [finalBotText, setFinalBotText] = useState(''); // 마지막 사용자 입력 저장

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const userMessageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [messageTops, setMessageTops] = useState<number[]>([]);
  const [userMessageTops, setUserMessageTops] = useState<number[]>([]);

  const [userInfo, setUserInfo] = useState({ nickname: '' });
  const [botMessages, setBotMessages] = useState<Message[]>([]);

  const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4, profileImg5, profileImg6];

  function ChatProfile() {
    const savedIndex = localStorage.getItem('profileIndex');
    const profileIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
    const selectedProfile = profileImages[profileIndex];

    return (
      <>
        <div className="absolute left-[51px] top-[2px] text-black text-[13px] font-bold font-['Noto_Sans_KR'] z-10">
          {userInfo.nickname}
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-full absolute left-[4px] top-[4px] z-10" />
        <img className="w-12 h-12 absolute left-0 top-0 z-10" src={selectedProfile} alt="프로필" />
      </>
    );
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const showMessages = async (msgs: Message[]) => {
      for (let i = 0; i < msgs.length; i++) {
        setActiveIndex(i);
        await new Promise((r) => setTimeout(r, msgs[i].delay));
        setVisibleMessages((prev) => [...prev, msgs[i].id]);
      }
      setInputVisible(true);
    };

    if (userId) {
      axios
        .get(`http://localhost:8080/api/user/${userId}`)
        .then((res) => {
          setUserInfo(res.data);
          const initialMessages: Message[] = [
            { id: 1, text: `안냥🐱~ 나는 너만의 앵커 ${res.data.nickname}이야!`, delay: 500 },
            { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
            { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
            { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
          ];
          setBotMessages(initialMessages);
          showMessages(initialMessages);
        })
        .catch(() => {
          const fallback: Message[] = [
            { id: 1, text: `안냥🐱~ 너만의 앵커!`, delay: 500 },
            { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
            { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
            { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
          ];
          setBotMessages(fallback);
          showMessages(fallback);
        });
    } else {
      const defaultMessages: Message[] = [
        { id: 1, text: `안냥🐱~ 너만의 앵커!`, delay: 500 },
        { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
        { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
        { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
      ];
      setBotMessages(defaultMessages);
      showMessages(defaultMessages);
    }
  }, []);

  useLayoutEffect(() => {
    messageRefs.current = messageRefs.current.slice(0, botMessages.length);
    let accHeight = 0;
    const gap = 10;
    const tops = botMessages.map((_, i) => {
      const el = messageRefs.current[i];
      const top = accHeight;
      accHeight += (el?.offsetHeight ?? 40) + gap;
      return top;
    });
    setMessageTops(tops);
  }, [visibleMessages, textSize, botMessages]);

  useLayoutEffect(() => {
    userMessageRefs.current = userMessageRefs.current.slice(0, userMessages.length);
    let accHeight = messageTops.length ? messageTops[messageTops.length - 1] + 60 : 200;
    const gap = 10;
    const tops = userMessages.map((_, i) => {
      const el = userMessageRefs.current[i];
      const top = accHeight;
      accHeight += (el?.offsetHeight ?? 40) + gap;
      return top;
    });
    setUserMessageTops(tops);
  }, [userMessages, messageTops]);

  const lastUserTop = userMessageTops[userMessageTops.length - 1] ?? 200;

  useEffect(() => {
    if (extraBotVisible) {
      const timer = setTimeout(() => {
        setShowFinalBotMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [extraBotVisible]);

  return (
    <main className="w-full flex justify-center">
      <div className="w-[365px] min-h-[300px] relative pb-20 mt-2">
        <ChatProfile />

        {botMessages.map((msg, idx) => {
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

        {extraBotVisible && !showFinalBotMessage && (
          <ChatMessage
            ref={null}
            topOffset={lastUserTop + 90}
            isVisible={false}
            isLoading={true}
            text=""
            textSize={textSize}
          />
        )}

        {extraBotVisible && showFinalBotMessage && (
          <>
            <div
              className="absolute left-[51px] text-black text-[13px] font-bold font-['Noto_Sans_KR'] z-10"
              style={{ top: lastUserTop + 60 }}
            >
              {userInfo.nickname || '앵커봇'}
            </div>
            <div
              className="w-10 h-10 bg-blue-50 rounded-full absolute left-[4px] z-10"
              style={{ top: lastUserTop + 62 }}
            />
            <img
              className="w-12 h-12 absolute left-0 z-10"
              style={{ top: lastUserTop + 58 }}
              src={profileImages[parseInt(localStorage.getItem('profileIndex') ?? '0')]}
              alt="프로필"
            />

            <ChatMessage
              ref={null}
              topOffset={lastUserTop + 90}
              isVisible={true}
              isLoading={false}
              text={`입력한 메시지가 ${finalBotText} 맞아?`}
              textSize={textSize}
            />
          </>
        )}

        {inputVisible && (
          <div
            className="fixed left-1/2 transform -translate-x-1/2 w-[370px] flex items-center space-x-2"
            style={{ bottom: 70, zIndex: 20 }}
          >
            <div className="flex-1 h-12 bg-[#e3e4e5] rounded-full relative">
              <input
                type="text"
                placeholder="키워드를 입력하라냥!"
                className="w-full h-full px-5 text-base rounded-full bg-white border border-[#e3e4e5] outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputText.trim()) {
                    setUserMessages((prev) => [...prev, inputText]);
                    setFinalBotText(inputText);
                    setInputText('');
                    setExtraBotVisible(false);
                    setShowFinalBotMessage(false);
                    setTimeout(() => {
                      setExtraBotVisible(true);
                    }, 100);
                  }
                }}
              />
            </div>
            <button
              type="button"
              className={`w-16 h-12 rounded-full text-white transition-colors ${
                inputText.trim() ? 'bg-blue-400 hover:bg-blue-500 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!inputText.trim()}
              onClick={() => {
                setUserMessages((prev) => [...prev, inputText]);
                setFinalBotText(inputText);
                setInputText('');
                setExtraBotVisible(false);
                setShowFinalBotMessage(false);
                setTimeout(() => {
                  setExtraBotVisible(true);
                }, 100);
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
