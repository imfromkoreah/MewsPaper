import { NavLink } from 'react-router-dom';
import HomeIcon from '../assets/svg/home_on.svg';
import NewsIcon from '../assets/svg/news_off.svg';
import ChatIcon from '../assets/svg/chat_off.svg';

export default function BottomNav() {
  return (
    <nav className="h-14 bg-white flex justify-around items-center shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
      <NavLink to="/home" className="focus:outline-none">
        <img src={HomeIcon} alt="홈" className="h-6 w-6" />
      </NavLink>
      <NavLink to="/news" className="focus:outline-none">
        <img src={NewsIcon} alt="뉴스" className="h-6 w-6" />
      </NavLink>
      <NavLink to="/chat" className="focus:outline-none">
        <img src={ChatIcon} alt="채팅" className="h-6 w-6" />
      </NavLink>
    </nav>
  );
}
