import { useEffect, useState, useRef, useLayoutEffect, forwardRef } from 'react';
import axios from 'axios';

// 프로필 이미지는 실제 경로에 맞게 사용하세요
import profileImg1 from '../../assets/character/mewsdoc.png';
import profileImg2 from '../../assets/character/mewsdoc2.png';
import profileImg3 from '../../assets/character/mewsdoc3.png';
import profileImg4 from '../../assets/character/mewsdoc4.png';
import profileImg5 from '../../assets/character/mewsdoc5.png';
import profileImg6 from '../../assets/character/mewsdoc6.png';

// ChatMessageItem 인터페이스를 더 명확하게 정의합니다.
interface ChatMessageItem {
  id: number;
  sender: 'bot' | 'user';
  type: 'text' | 'loading';
  text?: string;
  delay?: number;
  isVisible?: boolean;
  isLoading?: boolean;
}

interface ChatMessageProps {
  text: string;
  isVisible: boolean;
  isLoading: boolean;
  topOffset: number;
  textSize: string;
  isBotMessage: boolean;
  showProfileBefore?: boolean; 
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ text, isVisible, isLoading, topOffset, textSize, isBotMessage, showProfileBefore }, ref) => (
    <div
      ref={ref}
      className={`max-w-[260px] px-4 py-2.5 absolute inline-flex items-center gap-2.5 overflow-hidden ${
        isBotMessage
          ? 'left-[55px] bg-[#f1f1f1] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px]'
          : 'right-0 bg-[#6B4EFF] rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]'
      } ${isLoading ? 'h-10' : 'min-h-[40px]'}`}
      style={{ top: topOffset }}
    >
      {isVisible ? (
        <div
          className={`${
            isBotMessage ? 'text-[#1c283b]' : 'text-white'
          } text-base font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap ${textSize}`}
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

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessageItem[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [textSize] = useState('text-base');
  const [showConfirmationButtons, setShowConfirmationButtons] = useState(false);

  const allMessageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [messageTops, setMessageTops] = useState<number[]>([]);

  const [userInfo, setUserInfo] = useState({ nickname: '' });
  const isInitialLoadCompleted = useRef(false); 

  const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4, profileImg5, profileImg6];

  const ChatProfileIconAndNickname = ({ topOffset }: { topOffset: number }) => {
    const savedIndex = localStorage.getItem('profileIndex');
    const profileIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
    const selectedProfile = profileImages[profileIndex];

    return (
      <>
        <div className="absolute left-[51px] text-black text-[13px] font-bold font-['Noto_Sans_KR'] z-10"
            style={{ top: topOffset }}>
            {userInfo.nickname}
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-full absolute left-[4px] z-10"
            style={{ top: topOffset + 2 }} />
        <img className="w-12 h-12 absolute left-0 z-10"
            style={{ top: topOffset - 2 }} src={selectedProfile} alt="프로필" />
      </>
    );
  };

  useEffect(() => {
    if (isInitialLoadCompleted.current) {
        return;
    }
    isInitialLoadCompleted.current = true;

    const userId = localStorage.getItem('userId');

    const addInitialMessagesSequentially = async (msgs: { id: number; text: string; delay: number }[]) => {
      let currentId = 0;

      for (const msg of msgs) {
        const loadingMessageId = currentId++;
        setChatHistory(prev => [...prev, {
          id: loadingMessageId,
          sender: 'bot',
          type: 'loading',
          isLoading: true,
          isVisible: false,
          showProfileBefore: prev.length === 0 || prev[prev.length - 1]?.sender === 'user',
        }]);

        await new Promise(resolve => setTimeout(resolve, msg.delay / 2 || 500)); 

        const textMessageId = currentId++;
        setChatHistory(prev => {
          const updatedHistory = prev.filter(m => m.id !== loadingMessageId);
          const prevLoadingMsg = prev.find(m => m.id === loadingMessageId);
          return [...updatedHistory, {
            id: textMessageId,
            sender: 'bot',
            type: 'text',
            text: msg.text,
            isVisible: true,
            isLoading: false,
            showProfileBefore: prevLoadingMsg?.showProfileBefore,
          }];
        });

        await new Promise(resolve => setTimeout(resolve, msg.delay / 2 || 500));
      }
      setInputVisible(true);
    };

    if (userId) {
      axios.get(`http://localhost:8080/api/user/${userId}`).then((res) => {
        setUserInfo(res.data);
        const initialMessages = [
          { id: 1, text: `안냥🐱~ 나는 너만의 앵커 ${res.data.nickname}이야!`, delay: 1000 },
          { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
          { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
          { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
        ];
        addInitialMessagesSequentially(initialMessages);
      }).catch(() => {
        const fallback = [
          { id: 1, text: `안냥🐱~ 너만의 앵커!`, delay: 1000 },
          { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
          { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
          { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
        ];
        addInitialMessagesSequentially(fallback);
      });
    } else {
      const defaultMessages = [
        { id: 1, text: `안냥🐱~ 너만의 앵커!`, delay: 1000 },
        { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
        { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
        { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
      ];
      addInitialMessagesSequentially(defaultMessages);
    }
  }, []);

  useLayoutEffect(() => {
    allMessageRefs.current = allMessageRefs.current.slice(0, chatHistory.length);
    let accHeight = -30; 
    const gap = 10;
    const tops: number[] = [];

    chatHistory.forEach((msg, i) => {
      if (msg.sender === 'bot' && msg.showProfileBefore) {
          accHeight += 50; 
      }

      const el = allMessageRefs.current[i];
      const messageHeight = el?.offsetHeight && el.offsetHeight > 0 ? el.offsetHeight : 40; 
      
      tops.push(accHeight);
      accHeight += messageHeight + gap;
    });
    setMessageTops(tops);

    // 메시지 추가 시 최하단으로 스크롤
    const lastMessageElement = allMessageRefs.current[chatHistory.length - 1];
    if (lastMessageElement) {
        lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

  }, [chatHistory, textSize]);


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

      setChatHistory((prev) => {
        return prev.map((msg) =>
          msg.id === loadingBotMessage.id
            ? { ...msg, type: 'text', text: botResponseText, isLoading: false, isVisible: true, showProfileBefore: loadingBotMessage.showProfileBefore }
            : msg
        );
      });
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
      setChatHistory((prev) => {
        return prev.map((msg) =>
          msg.id === loadingBotMessage.id
            ? { ...msg, type: 'text', text: `입력한 검색어가 "${newUserMessage.text}" 맞아?`, isLoading: false, isVisible: true, showProfileBefore: loadingBotMessage.showProfileBefore }
            : msg
        );
      });
      setShowConfirmationButtons(true); 
      setInputVisible(false); 
    }, 1500);
  };


  return (
    // main 태그는 Layout에서 이미 TopNav와 BottomNav 공간을 제외하고 overflow-y-auto를 가집니다.
    // ChatPage는 이 main 태그의 자식으로 들어갑니다.
    // 따라서 ChatPage 내부의 chat-container는 고정된 입력/버튼 영역에 대한 공간만 확보하면 됩니다.
    <div className="w-full flex justify-center">
      <div 
        className="w-[365px] min-h-[300px] relative chat-container" 
        // chat-container는 Layout의 main 안에 있으므로, Layout의 main이 스크롤을 담당합니다.
        // 따라서 chat-container 자체의 height는 최소 높이만 지정하고, overflow-y-auto는 제거합니다.
        // 하단 fixed된 입력창 (bottom: 70px, height: 48px)의 높이만큼 padding-bottom을 줍니다.
        // (70px는 bottomNav 위에 여유있게 떠있는 위치이므로, 70px + 48px=118px를 커버해야 합니다.
        //  Layout의 main이 BottomNav의 56px을 이미 처리하므로, 70px만 padding을 줘도 입력창은 가려지지 않습니다.)
        style={{ paddingBottom: '70px' }} // 입력창의 bottom 값만큼 패딩을 주면 됩니다.
      >
        {chatHistory.map((msg, idx) => (
          <div key={msg.id}>
            {msg.sender === 'bot' && msg.showProfileBefore && messageTops[idx] !== undefined && (
              <ChatProfileIconAndNickname topOffset={(messageTops[idx] ?? 0) - 10} /> 
            )}
            <ChatMessage
              ref={(el) => (allMessageRefs.current[idx] = el)}
              topOffset={(messageTops[idx] ?? 0) + 15} 
              isVisible={msg.isVisible ?? true}
              isLoading={msg.isLoading === true}
              text={msg.text ?? ''}
              textSize={textSize}
              isBotMessage={msg.sender === 'bot'}
              showProfileBefore={msg.showProfileBefore}
            />
          </div>
        ))}

        {/* 확인 버튼 영역 (fixed) */}
        {showConfirmationButtons && (
          <div
            className="fixed left-1/2 transform -translate-x-1/2 bottom-[70px] z-20 flex space-x-4"
          >
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full"
              onClick={() => onConfirmReply('응!')}
            >
              응!
            </button>
            <button
              className="bg-gray-300 text-black px-6 py-2 rounded-full"
              onClick={() => onConfirmReply('아니야')}
            >
              아니야
            </button>
          </div>
        )}

        {/* 입력창 영역 (fixed) */}
        {inputVisible && !showConfirmationButtons && (
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
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
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
              onClick={handleSendMessage}
            >
              전송
            </button>
          </div>
        )}
      </div>
    </div>
  );
}