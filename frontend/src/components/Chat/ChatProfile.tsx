// 봇 메시지 + 프로필 컴포넌트
import profileImg1 from '../../assets/character/mewsdoc.png';
import profileImg2 from '../../assets/character/mewsdoc2.png';
import profileImg3 from '../../assets/character/mewsdoc3.png';
import profileImg4 from '../../assets/character/mewsdoc4.png';
import profileImg5 from '../../assets/character/mewsdoc5.png';
import profileImg6 from '../../assets/character/mewsdoc5.png';

const profileImages = [profileImg1, profileImg2, profileImg3, profileImg4, profileImg5, profileImg6];

interface ChatProfileProps {
  nickname: string;
}

export default function ChatProfile({ nickname }: ChatProfileProps) {
  const savedIndex = localStorage.getItem('profileIndex');
  const profileIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
  const selectedProfile = profileImages[profileIndex];

  return (
    <>
      <div className="absolute left-[51px] top-[2px] text-black text-[13px] font-bold font-['Noto_Sans_KR'] z-10">
        {nickname}
      </div>
      <div className="w-10 h-10 bg-blue-50 rounded-full absolute left-[4px] top-[4px] z-10" />
      <img className="w-12 h-12 absolute left-0 top-0 z-10" src={selectedProfile} alt="프로필" />
    </>
  );
}
