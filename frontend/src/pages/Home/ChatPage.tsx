import { useRef, useLayoutEffect, useState } from 'react';
import ChatMessage from '../../components/Chat/ChatMessage';
import UserChatMessage from '../../components/Chat/UserChatMessage';
import ChatProfile from '../../components/Chat/ChatProfile';
import InputBox from '../../components/Chat/InputBox';
import { useChatFlow } from '../../hooks/useChatFlow';

// 🔹 메시지 흐름과 상태 관리 로직은 useChatFlow로부터 가져옴
export default function ChatPage() {
  const {
    visibleMessages,
    activeIndex,
    inputVisible,
    inputText,
    setInputText,
    handleSend,
    userMessages,
    userInfo,
    botMessages,
  } = useChatFlow();

    // 🔹 메시지 위치 계산용 state + ref
  const [messageTops, setMessageTops] = useState<number[]>([]);
  const [userMessageTops, setUserMessageTops] = useState<number[]>([]);
  const [textSize] = useState('text-base');

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const userMessageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 🔹 챗봇 메시지 위치 계산 (각 메시지 높이 + 간격 누적)
  useLayoutEffect(() => {
    messageRefs.current = messageRefs.current.slice(0, botMessages.length);
    let acc = 0;
    const gap = 10;
    const tops = botMessages.map((_, i) => {
      const el = messageRefs.current[i];
      const top = acc;
      acc += (el?.offsetHeight ?? 40) + gap;
      return top;
    });
    setMessageTops(tops);
  }, [visibleMessages, textSize, botMessages]);

  // 🔹 유저 메시지 위치 계산
  useLayoutEffect(() => {
    userMessageRefs.current = userMessageRefs.current.slice(0, userMessages.length);
    let acc = messageTops.length ? messageTops[messageTops.length - 1] + 60 : 200;
    const gap = 10;
    const tops = userMessages.map((_, i) => {
      const el = userMessageRefs.current[i];
      const top = acc;
      acc += (el?.offsetHeight ?? 40) + gap;
      return top;
    });
    setUserMessageTops(tops);
  }, [userMessages, messageTops]);

  return (
    <main className="w-full flex justify-center">
      <div className="w-[365px] min-h-[300px] relative pb-20 mt-2">
        {/* 1️⃣ 프로필 출력 */}
        <ChatProfile nickname={userInfo.nickname} />

        {/* 2️⃣ 챗봇 메시지 출력 */}
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

        {/* 3️⃣ 유저 메시지 출력 */}
        {userMessages.map((msg, idx) => (
          <UserChatMessage
            key={`user-${idx}`}
            ref={(el) => (userMessageRefs.current[idx] = el)}
            text={msg}
            topOffset={(userMessageTops[idx] ?? 0) + 30}
          />
        ))}
        
        {/* 4️⃣ 입력창 출력 */}
        {inputVisible && (
            <InputBox
              value={inputText}
              onChange={setInputText}
              onSend={handleSend}
            />
          )}
      </div>
    </main>
  );
}
