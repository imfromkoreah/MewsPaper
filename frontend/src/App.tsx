import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Join from './pages/Login/Join';
import Login from './pages/Login/Login';
import Calendar from './components/Calendar';
import AttendanceCalendar from './components/AttendanceCalendar';
import ScrapNews from './components/ScrapNews';

import HomePage from './pages/Home';
import NewsPage from './pages/Home/NewsPage';
import NewsDetailPage from './pages/Home/NewsDetailPage';
import ChatPage from './pages/Home/ChatPage';
import MyPage from './pages/Home/MyPage';
import NotificationPage from './pages/Home/NotificationPage';


import SettingsPage from './pages/Settings/SettingsPage';
import AccountInfoPage from './pages/Settings/AccountInfoPage';
import NotificationSettingsPage from './pages/Settings/NotificationSettingsPage';
import NewsAlertTimePage from './pages/Settings/NewsAlertTimePage';

import NaverCallback from './pages/Auth/NaverCallback'; // <-- 이 줄이 중요합니다!
import GoogleCallback from './pages/Auth/GoogleCallback'; // <-- 이 줄이 중요합니다!


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Splash" />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
      <Route path="/noti" element={<NotificationPage />} />
      <Route path="/news/detail" element={<NewsDetailPage />} />
      <Route path="/home/mypage" element={<MyPage />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/attendanceCalendar" element={<AttendanceCalendar />} />
      <Route path="/scrap-news" element={<ScrapNews />} />

      {/* Settings 관련 페이지들 */}
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/account" element={<AccountInfoPage />} />
      <Route path="/settings/notification" element={<NotificationSettingsPage />} />
      <Route path="/settings/news-alert-time" element={<NewsAlertTimePage />} />

      {/* ⭐⭐ 이 라우트가 반드시 있어야 합니다 ⭐⭐ */}
      <Route path="/auth/naver/callback" element={<NaverCallback />} />
      <Route path="/google/callback" element={<GoogleCallback />} />

      {/* Layout이 적용되는 라우트 그룹 */}
      <Route
        path="/home"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/news"
        element={
          <Layout>
            <NewsPage />
          </Layout>
        }
      />
      <Route
        path="/chat"
        element={
          <Layout>
            <ChatPage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
