import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Join from './pages/Login/Join';
import Login from './pages/Login/Login';
import HomePage from './pages/Home';
import NewsPage from './pages/Home/NewsPage';
import ChatPage from './pages/Home/ChatPage';

import NotificationPage from './pages/Home/NotificationPage';

import SettingsPage from './pages/Settings/SettingsPage';
import AccountInfoPage from './pages/Settings/AccountInfoPage';
import NotificationSettingsPage from './pages/Settings/NotificationSettingsPage';
import NewsAlertTimePage from './pages/Settings/NewsAlertTimePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
      <Route path="/noti" element={<NotificationPage />} />

      {/* Settings 관련 페이지들 */}
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/account" element={<AccountInfoPage />} />
      <Route path="/settings/notification" element={<NotificationSettingsPage />} />
      <Route path="/settings/news-alert-time" element={<NewsAlertTimePage />} />

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
