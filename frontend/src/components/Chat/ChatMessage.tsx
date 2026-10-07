// 챗봇 메시지 컴포넌트
import { forwardRef } from 'react';
import LoadingDots from './LoadingDots';

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
        <div className={`text-[#1c283b] text-base font-normal font-['Inter'] leading-tight break-words whitespace-pre-wrap ${textSize}`}>
          {text}
        </div>
      ) : isLoading ? (
        <LoadingDots />
      ) : null}
    </div>
  )
);
ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
