import { NavLink } from 'react-router-dom';
import HomeOnIcon from '../assets/svg/home_on.svg';
import NewsOnIcon from '../assets/svg/news_on.svg';
import ChatOnIcon from '../assets/svg/chat_on.svg';
import HomeOffIcon from '../assets/svg/home_off.svg';
import NewsOffIcon from '../assets/svg/news_off.svg';
import ChatOffIcon from '../assets/svg/chat_off.svg';

export default function BottomNav() {
  return (
    <nav className="h-14 bg-white flex justify-around items-center shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
      <NavLink to="/home" className="focus:outline-none">
        {({ isActive }) => (
          <img
            src={isActive ? HomeOnIcon : HomeOffIcon}
            alt="홈"
            className="h-6 w-6"
          />
        )}
      </NavLink>

      <NavLink to="/news" className="focus:outline-none">
        {({ isActive }) => (
          <img
            src={isActive ? NewsOnIcon : NewsOffIcon}
            alt="뉴스"
            className="h-6 w-6"
          />
        )}
      </NavLink>

      <NavLink to="/chat" className="focus:outline-none">
        {({ isActive }) => (
          <img
            src={isActive ? ChatOnIcon : ChatOffIcon}
            alt="채팅"
            className="h-6 w-6"
          />
        )}
      </NavLink>
    </nav>
  );
}
