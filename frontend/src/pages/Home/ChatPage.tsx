import { useEffect, useState, useRef, forwardRef } from 'react';
import axios from 'axios';

import profileImg1 from '../../assets/character/mewsdoc.png';
import profileImg2 from '../../assets/character/mewsdoc2.png';
import profileImg3 from '../../assets/character/mewsdoc3.png';
import profileImg4 from '../../assets/character/mewsdoc4.png';
import profileImg5 from '../../assets/character/mewsdoc5.png';
import profileImg6 from '../../assets/character/mewsdoc6.png';

interface ChatMessageItem {
  id: number;
  sender: 'bot' | 'user';
  type: 'text' | 'loading';
  text?: string;
  delay?: number;
  isVisible?: boolean;
  isLoading?: boolean;
  showProfileBefore?: boolean; 
}

interface ChatMessageProps {
  text: string;
  isVisible: boolean;
  isLoading: boolean;
  textSize: string;
  isBotMessage: boolean;
  className?: string; 
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ text, isVisible, isLoading, textSize, isBotMessage, className }, ref) => (
    <div
      ref={ref}
      className={`max-w-[260px] px-4 py-2.5 inline-flex items-center gap-2.5 overflow-hidden ${
        isBotMessage
          ? 'bg-[#f1f1f1] text-[#1c283b] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px]'
          : 'bg-[#6B4EFF] text-white rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]'
      } ${isLoading ? 'h-10' : 'min-h-[40px]'} ${className || ''}`}
    >
      {isVisible ? (
        <div
          className={`text-base font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap ${textSize}`}
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

const ChatProfileIconAndNickname = ({
  nickname,
  profileImage,
}: {
  nickname: string;
  profileImage: string;
}) => (
  <div className="flex items-center gap-2 mb-1">
    <img className="w-10 h-10 flex-shrink-0" src={profileImage} alt="프로필" />
    <div className="text-black text-[13px] font-bold font-['Noto_Sans_KR'] truncate">
      {nickname}
    </div>
  </div>
);

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [textSize] = useState('text-base');
  const [showConfirmationButtons, setShowConfirmationButtons] = useState(false);

  const allMessageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [userInfo, setUserInfo] = useState({ nickname: '' });
  const isInitialLoadCompleted = useRef(false);

  const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4, profileImg5, profileImg6];
  const savedIndex = localStorage.getItem('profileIndex');
  const profileIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
  const selectedProfile = profileImages[profileIndex];

  useEffect(() => {
    if (isInitialLoadCompleted.current) {
      return;
    }
    isInitialLoadCompleted.current = true;

    const userId = localStorage.getItem('userId');

    const addInitialMessagesSequentially = async (msgs: { id: number; text: string; delay: number }[]) => {
      let currentMsgIdx = 0; 

      for (const msg of msgs) {
        const loadingMessageId = Date.now() + currentMsgIdx * 2; 
        setChatHistory((prev) => {
          const isFirstMessageInSequence = currentMsgIdx === 0;
          return [
            ...prev,
            {
              id: loadingMessageId,
              sender: 'bot',
              type: 'loading',
              isLoading: true,
              isVisible: false,
              showProfileBefore: isFirstMessageInSequence, 
            },
          ];
        });

        await new Promise((resolve) => setTimeout(resolve, msg.delay / 2 || 500));

        const textMessageId = Date.now() + currentMsgIdx * 2 + 1; 
        setChatHistory((prev) => {
          const updatedHistory = prev.filter((m) => m.id !== loadingMessageId);
          const prevLoadingMsg = prev.find((m) => m.id === loadingMessageId);
          return [
            ...updatedHistory,
            {
              id: textMessageId,
              sender: 'bot',
              type: 'text',
              text: msg.text,
              isVisible: true,
              isLoading: false,
              showProfileBefore: prevLoadingMsg?.showProfileBefore, 
            },
          ];
        });

        await new Promise((resolve) => setTimeout(resolve, msg.delay / 2 || 500));
        currentMsgIdx++; 
      }
      setInputVisible(true);
    };

    if (userId) {
      axios
        .get(`http://localhost:8080/api/user/${userId}`)
        .then((res) => {
          setUserInfo(res.data);
          const initialMessages = [
            { id: 1, text: `안냥🐱~ 나는 너만의 앵커 ${res.data.nickname}이야!`, delay: 1000 },
            { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
            { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
            { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
          ];
          addInitialMessagesSequentially(initialMessages);
        })
        .catch((error) => {
          console.error("Failed to fetch user info, using fallback messages:", error);
          const fallback = [
            { id: 1, text: `안냥🐱~ 너만의 앵커!`, delay: 1000 },
            { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
            { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
            { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
          ];
          addInitialMessagesSequentially(fallback);
        });
    } else {
      setInputVisible(false);
    }
  }, []);

  function onConfirmReply(reply: string) {
    const userConfirmMessage: ChatMessageItem = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: reply,
    };
    setChatHistory((prev) => [...prev, userConfirmMessage]);
    setShowConfirmationButtons(false); 

    const loadingBotMessage: ChatMessageItem = {
      id: Date.now() + 1,
      sender: 'bot',
      type: 'loading',
      isLoading: true,
      isVisible: false,
      showProfileBefore: true, 
    };
    setChatHistory((prev) => [...prev, loadingBotMessage]);

    setTimeout(() => {
      let botResponseText = '';
      let shouldActivateInput = false;

      if (reply === '응!') {
        botResponseText = '좋아! 관련 뉴스를 찾아줄게. 잠시만 기다려 줘!';
        shouldActivateInput = false; 
      } else if (reply === '아니야') {
        botResponseText = '아니구나! 다시 정확한 키워드를 입력해 줄래?';
        shouldActivateInput = true; 
      }

      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingBotMessage.id
            ? {
                ...msg,
                type: 'text',
                text: botResponseText,
                isLoading: false,
                isVisible: true,
                showProfileBefore: loadingBotMessage.showProfileBefore, 
              }
            : msg
        )
      );
      setInputVisible(shouldActivateInput); 
    }, 1500);
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newUserMessage: ChatMessageItem = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text: inputText,
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setInputText('');
    setInputVisible(false); 

    const loadingBotMessage: ChatMessageItem = {
      id: Date.now() + 1,
      sender: 'bot',
      type: 'loading',
      isLoading: true,
      isVisible: false,
      showProfileBefore: true, 
    };
    setChatHistory((prev) => [...prev, loadingBotMessage]);

    setTimeout(() => {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingBotMessage.id
            ? {
                ...msg,
                type: 'text',
                text: `입력한 검색어가 "${newUserMessage.text}" 맞아?`,
                isLoading: false,
                isVisible: true,
                showProfileBefore: loadingBotMessage.showProfileBefore, 
              }
            : msg
        )
      );
      setShowConfirmationButtons(true); 
    }, 1500);
  };

  // 스크롤 로직 수정
  useEffect(() => {
    const lastMsgEl = allMessageRefs.current[chatHistory.length - 1];
    if (lastMsgEl) {
      // setTimeout을 사용하여 DOM 렌더링 후 스크롤이 실행되도록 합니다.
      const timer = setTimeout(() => {
        lastMsgEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100); // 100ms 정도의 지연 시간

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [chatHistory]);

  return (
    <div className="relative h-full w-full">
      {/* 메시지 리스트 */}
      <div className="overflow-y-auto h-full px-8 pt-5 pb-[72px] flex flex-col">
        {chatHistory.map((msg, idx) => (
          <div key={msg.id} className={`mb-2 last:mb-0 ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
            {msg.sender === 'bot' ? (
              <div className="flex flex-col items-start">
                {msg.showProfileBefore && (
                  <ChatProfileIconAndNickname
                    nickname={userInfo.nickname}
                    profileImage={selectedProfile}
                  />
                )}
                <ChatMessage
                  ref={(el) => (allMessageRefs.current[idx] = el)}
                  isVisible={msg.isVisible ?? true}
                  isLoading={msg.isLoading === true}
                  text={msg.text ?? ''}
                  textSize={textSize}
                  isBotMessage={msg.sender === 'bot'}
                  className={'ml-[calc(40px+8px)]'} 
                />
              </div>
            ) : (
              <ChatMessage
                ref={(el) => (allMessageRefs.current[idx] = el)}
                isVisible={msg.isVisible ?? true}
                isLoading={msg.isLoading === true}
                text={msg.text ?? ''}
                textSize={textSize}
                isBotMessage={msg.sender === 'bot'}
              />
            )}
          </div>
        ))}
      </div>

      {/* 입력창/확인 버튼 영역: BottomNav 위 고정 */}
      <div className="fixed bottom-[56px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 bg-white">
        {showConfirmationButtons ? (
          // 확인 버튼
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onConfirmReply('응!')}
              className="px-6 py-2 rounded-full bg-blue-500 text-white" 
            >
              응!
            </button>
            <button
              onClick={() => onConfirmReply('아니야')}
              className="px-6 py-2 rounded-full bg-gray-300 text-gray-800" 
            >
              아니야
            </button>
          </div>
        ) : (
          // 사용자 입력창
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="flex-1 rounded-full px-4 py-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="메시지를 입력하세요"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!inputVisible}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-3 rounded-full"
              disabled={!inputVisible || !inputText.trim()}
            >
              전송
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatPage;