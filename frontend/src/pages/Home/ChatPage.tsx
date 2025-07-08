import { useEffect, useRef, useState } from 'react';
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

const ChatMessage = ({
  text,
  isVisible,
  isLoading,
  textSize,
  isBotMessage,
  className,
}: ChatMessageProps) => (
  <div
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
);

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

  const [userInfo, setUserInfo] = useState({ nickname: '' });
  const isInitialLoadCompleted = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4, profileImg5, profileImg6];
  const savedIndex = localStorage.getItem('profileIndex');
  const profileIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
  const selectedProfile = profileImages[profileIndex];

  useEffect(() => {
    if (isInitialLoadCompleted.current) return;
    isInitialLoadCompleted.current = true;

    const userId = localStorage.getItem('userId');

    // 로딩 상태 유지 시간 (ms)
    const LOADING_DURATION = 600;
    // 텍스트 노출 후 다음 메시지 전 대기 시간 (ms)
    const BETWEEN_MESSAGES_DELAY = 200;

    const addInitialMessagesSequentially = async (msgs: { id: number; text: string; delay?: number }[]) => {
      let currentMsgIdx = 0;
      for (const msg of msgs) {
        const loadingMessageId = Date.now() + currentMsgIdx * 2;
        // 1) 로딩 메시지 추가
        setChatHistory((prev) => [
          ...prev,
          {
            id: loadingMessageId,
            sender: 'bot',
            type: 'loading',
            isLoading: true,
            isVisible: false,
            showProfileBefore: currentMsgIdx === 0,
          },
        ]);

        await new Promise((r) => setTimeout(r, LOADING_DURATION));

        const textMessageId = Date.now() + currentMsgIdx * 2 + 1;
        // 2) 로딩 메시지 삭제 후 텍스트 메시지 추가
        setChatHistory((prev) =>
          [...prev.filter((m) => m.id !== loadingMessageId),
          {
            id: textMessageId,
            sender: 'bot',
            type: 'text',
            text: msg.text,
            isVisible: true,
            isLoading: false,
            showProfileBefore: currentMsgIdx === 0,
          }]
        );

        await new Promise((r) => setTimeout(r, BETWEEN_MESSAGES_DELAY));

        currentMsgIdx++;
      }
      setInputVisible(true);
    };

    if (userId) {
      axios.get(`http://localhost:8080/api/user/${userId}`)
        .then((res) => {
          setUserInfo(res.data);
          const initialMessages = [
            { id: 1, text: `안냥🐱~ 나는 너만의 앵커 ${res.data.nickname}이야!` },
            { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야' },
            { id: 3, text: '궁금한 뉴스가 있다면...' },
            { id: 4, text: '나에게 말을 걸어줘!' },
          ];
          addInitialMessagesSequentially(initialMessages);
        })
        .catch(() => {
          const fallback = [
            { id: 1, text: `안냥🐱~ 너만의 앵커!` },
            { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야' },
            { id: 3, text: '궁금한 뉴스가 있다면...' },
            { id: 4, text: '나에게 말을 걸어줘!' },
          ];
          addInitialMessagesSequentially(fallback);
        });
    }
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [chatHistory]);

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
              }
            : msg
        )
      );
      setShowConfirmationButtons(true);
    }, 1500);
  };

  const onConfirmReply = (reply: string) => {
  const confirmMsg: ChatMessageItem = {
    id: performance.now(),
    sender: 'user',
    type: 'text',
    text: reply
  };
  setChatHistory((prev) => [...prev, confirmMsg]);
  setShowConfirmationButtons(false);

  const loadingId1 = performance.now() + 1;
  setChatHistory((prev) => [...prev, {
    id: loadingId1,
    sender: 'bot',
    type: 'loading',
    isLoading: true,
    isVisible: false,
    showProfileBefore: true
  }]);

  if (reply === '응!') {
    const lastKeyword = chatHistory.filter((m) => m.sender === 'user').slice(-1)[0]?.text || '';

    axios.post('http://localhost:8080/api/search/news', {
      keyword: lastKeyword,
      userId: localStorage.getItem('userId')
    })
    .then(() => {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingId1
            ? {
                ...msg,
                type: 'text',
                text: '좋아! 관련 뉴스를 찾아 요약해줄게. 잠시만 기다려 줘!',
                isLoading: false,
                isVisible: true
              }
            : msg
        )
      );

      const loadingId2 = performance.now() + 2;
      setChatHistory((prev) => [...prev, {
        id: loadingId2,
        sender: 'bot',
        type: 'loading',
        isLoading: true,
        isVisible: false,
        showProfileBefore: true
      }]);

      axios.get(`http://localhost:8080/api/search/news?keyword=${encodeURIComponent(lastKeyword)}`)
        .then((res) => {
          const newsList = res.data;

          // 여기서 요약 API 호출 시작
          axios.post('http://localhost:8080/api/summarize', newsList) // 중괄호 ❌ 없이 그대로
            .then((summaryRes) => {
              const summaryText = summaryRes.data.summary; // 서버에서 받은 요약문

              setChatHistory((prev) => {
                const filtered = prev.filter((m) => m.id !== loadingId2);
                // 요약된 내용 메시지로 추가
                return [
                  ...filtered,
                  {
                    id: performance.now() + 100,
                    sender: 'bot',
                    type: 'text',
                    text: `📝 요약: ${summaryText}`,
                    isVisible: true,
                    isLoading: false,
                    showProfileBefore: true
                  }
                ];
              });
              setInputVisible(true);
            })
            .catch(() => {
              // 요약 실패 시 원래 뉴스 리스트 보여주기
              setChatHistory((prev) => {
                const filtered = prev.filter((m) => m.id !== loadingId2);
                const newsMessages = newsList.map((news: any, idx: number) => ({
                  id: performance.now() + 100 + idx,
                  sender: 'bot',
                  type: 'text',
                  text: `🔹 ${news.title}`,
                  isVisible: true,
                  isLoading: false,
                  showProfileBefore: idx === 0
                }));
                return [...filtered, ...newsMessages];
              });
              setInputVisible(true);
            });
        })
        .catch(() => {
          setChatHistory((prev) =>
            prev.map((msg) =>
              msg.id === loadingId2
                ? {
                    ...msg,
                    type: 'text',
                    text: '뉴스를 가져오는 데 실패했어. 다시 시도해줘!',
                    isLoading: false,
                    isVisible: true
                  }
                : msg
            )
          );
          setInputVisible(true);
        });
    })
    .catch(() => {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingId1
            ? {
                ...msg,
                type: 'text',
                text: '서버에 문제가 생겼어. 다시 시도해줘!',
                isLoading: false,
                isVisible: true
              }
            : msg
        )
      );
      setInputVisible(true);
    });
  } else {
    setTimeout(() => {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingId1
            ? {
                ...msg,
                type: 'text',
                text: '아니구나! 다시 정확한 키워드를 입력해 줄래?',
                isLoading: false,
                isVisible: true
              }
            : msg
        )
      );
      setInputVisible(true);
    }, 1500);
  }
};



  return (
    <div className="relative h-full w-full">
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
                  isVisible={msg.isVisible ?? true}
                  isLoading={msg.isLoading === true}
                  text={msg.text ?? ''}
                  textSize={textSize}
                  isBotMessage
                  className="ml-[calc(40px+8px)]"
                />
              </div>
            ) : (
              <ChatMessage
                isVisible={msg.isVisible ?? true}
                isLoading={msg.isLoading === true}
                text={msg.text ?? ''}
                textSize={textSize}
                isBotMessage={false}
              />
            )}
          </div>
        ))}

        {/* ⬇️ 스크롤 앵커, 여유 공간 확보 */}
        <div ref={scrollRef} className="mt-[140px]" />
      </div>

      {/* 입력창 */}
      <div className="fixed bottom-[56px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 bg-white">
        {showConfirmationButtons ? (
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
