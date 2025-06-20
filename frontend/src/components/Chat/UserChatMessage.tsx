// 사용자 메시지 컴포넌트 
import { forwardRef } from 'react';

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

export default UserChatMessage;
