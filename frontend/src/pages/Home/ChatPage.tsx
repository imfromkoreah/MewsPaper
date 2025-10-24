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
    type: 'text' | 'loading' | 'link'; // 'link' 타입 추가
    text?: string;
    link?: string; // 링크 URL 필드 추가
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
    link?: string; // ChatMessage 컴포넌트에도 link prop 추가
}

const ChatMessage = ({
    text,
    isVisible,
    isLoading,
    textSize,
    isBotMessage,
    className,
    link, // link prop 받기
}: ChatMessageProps) => (
    <div
        className={`max-w-[260px] px-4 py-2.5 inline-flex items-center gap-2.5 overflow-hidden ${
            isBotMessage
                ? 'bg-[#f1f1f1] text-[#1c283b] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px]'
                : 'bg-[#6B4EFF] text-white rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]'
        } ${isLoading ? 'h-10' : 'min-h-[40px]'} ${className || ''}`}
    >
        {isVisible ? (
            link ? ( // 링크가 있을 경우 <a> 태그로 렌더링
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-base font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap underline text-blue-600 hover:text-blue-800 visited:text-purple-600 ${textSize}`}
                >
                    {text}
                </a>
            ) : ( // 링크가 없을 경우 일반 텍스트 렌더링
                <div
                    className={`text-base font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap ${textSize}`}
                >
                    {text}
                </div>
            )
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
    const [showLinkConfirmationButtons, setShowLinkConfirmationButtons] = useState(false); // 링크 확인 버튼 상태
    const [lastFetchedNewsLinks, setLastFetchedNewsLinks] = useState<any[]>([]); // 마지막으로 가져온 뉴스 링크 저장

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

    const onConfirmReply = async (reply: string) => {
        const confirmMsg: ChatMessageItem = {
            id: performance.now(),
            sender: 'user',
            type: 'text',
            text: reply
        };
        setChatHistory((prev) => [...prev, confirmMsg]);
        setShowConfirmationButtons(false);
        setInputVisible(false); // 사용자 응답 후 입력창 비활성화

        // 첫 번째 로딩 애니메이션 (뉴스 검색 대기)
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
            const lastKeyword = chatHistory.filter((m) => m.sender === 'user' && m.type === 'text').slice(-1)[0]?.text || '';

            try {
                // 키워드 저장 (POST)
                await axios.post('http://localhost:8080/api/search/news', {
                    keyword: lastKeyword,
                    userId: localStorage.getItem('userId')
                });

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

                // 뉴스 검색 (GET)
                const newsRes = await axios.get(
                    `http://localhost:8080/api/search/news?keyword=${encodeURIComponent(lastKeyword)}`
                );
                const newsList = newsRes.data;
                setLastFetchedNewsLinks(newsList); // 뉴스 링크 저장

                // ✅ 요약문을 DB에서 GET으로 가져오기 (/api/summary)
                const userId = localStorage.getItem('userId');
                const summaryRes = await axios.get('http://localhost:8080/api/summary', {
                    params: { userId, keyword: lastKeyword }
                });
                const summaryText = summaryRes.data.summary;

                // ✅ DB에 저장된 요약문 그대로 표시
                const botMessage: ChatMessageItem = {
                    id: performance.now(),
                    sender: 'bot',
                    type: 'text',
                    text: summaryText, // 그대로 사용
                    isVisible: true,
                    isLoading: false,
                    showProfileBefore: true,
                };

                setChatHistory((prev) => [...prev, botMessage]);

                // 요약 완료 후 링크 확인 메시지 및 버튼 표시
                setTimeout(() => {
                    setChatHistory((prev) => [
                        ...prev,
                        {
                            id: performance.now() + 500,
                            sender: 'bot',
                            type: 'text',
                            text: '관련 기사 링크를 직접 볼래?',
                            isVisible: true,
                            isLoading: false,
                            showProfileBefore: true,
                        },
                    ]);
                    setShowLinkConfirmationButtons(true);
                }, 1000);

            } catch (error) {
                console.error("뉴스 검색 또는 요약 API 호출 실패:", error);
                setChatHistory((prev) =>
                    prev.map((msg) =>
                        msg.id === loadingId1
                            ? {
                                ...msg,
                                type: 'text',
                                text: '뉴스를 가져오거나 요약하는 데 실패했어. 다시 시도해줘!',
                                isLoading: false,
                                isVisible: true
                            }
                            : msg
                    )
                );
                setInputVisible(true);
            }
        } else { // '아니야' 답변
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

    const onConfirmLinkReply = async (reply: string) => {
        const confirmMsg: ChatMessageItem = {
            id: performance.now(),
            sender: 'user',
            type: 'text',
            text: reply
        };
        setChatHistory((prev) => [...prev, confirmMsg]);
        setShowLinkConfirmationButtons(false); // 링크 확인 버튼 숨기기
        setInputVisible(false); // 사용자 응답 후 입력창 비활성화

        if (reply === '응!') {
            // 뉴스 링크들을 순차적으로 표시
            for (let i = 0; i < lastFetchedNewsLinks.length; i++) {
                const news = lastFetchedNewsLinks[i];
                const loadingMessageId = performance.now() + 600 + i * 2;
                const textMessageId = performance.now() + 601 + i * 2;

                setChatHistory((prev) => [
                    ...prev,
                    {
                        id: loadingMessageId,
                        sender: 'bot',
                        type: 'loading',
                        isLoading: true,
                        isVisible: false,
                        showProfileBefore: i === 0, // 첫 번째 링크 메시지에만 프로필 표시
                    }
                ]);

                await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 애니메이션 시간

                setChatHistory((prev) => {
                    const filteredPrev = prev.filter(m => m.id !== loadingMessageId);
                    return [
                        ...filteredPrev,
                        {
                            id: textMessageId,
                            sender: 'bot',
                            type: 'link', // type을 'link'로 설정
                            text: news.title, // 링크 텍스트는 뉴스 제목
                            link: news.url, // 실제 링크 URL
                            isVisible: true,
                            isLoading: false,
                            showProfileBefore: i === 0,
                        }
                    ];
                });

                if (i < lastFetchedNewsLinks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // 각 링크 메시지 사이 간격
                }
            }
            // 모든 링크가 표시된 후 입력창 활성화
            setInputVisible(true);
        } else { // '아니야' 답변
            setTimeout(() => {
                setChatHistory((prev) => [...prev, {
                    id: performance.now() + 700,
                    sender: 'bot',
                    type: 'text',
                    text: '알겠어! 다른 궁금한 점이 있다면 언제든지 물어봐!',
                    isVisible: true,
                    isLoading: false,
                    showProfileBefore: true,
                }]);
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
                                    link={msg.link} // link prop 전달
                                />
                            </div>
                        ) : (
                            <ChatMessage
                                isVisible={msg.isVisible ?? true}
                                isLoading={msg.isLoading === true}
                                text={msg.text ?? ''}
                                textSize={textSize}
                                isBotMessage={false}
                                link={msg.link} // link prop 전달
                            />
                        )}
                    </div>
                ))}

                {/* ⬇️ 스크롤 앵커, 여유 공간 확보 */}
                <div ref={scrollRef} className="mt-[140px]" />
            </div>

            {/* 입력창 */}
            <div className="fixed bottom-[56px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 bg-white border-l border-r border-gray-200">
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
                ) : showLinkConfirmationButtons ? ( // 링크 확인 버튼 조건 추가
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => onConfirmLinkReply('응!')}
                            className="px-6 py-2 rounded-full bg-blue-500 text-white"
                        >
                            응!
                        </button>
                        <button
                            onClick={() => onConfirmLinkReply('아니야')}
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
