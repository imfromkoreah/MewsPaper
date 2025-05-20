import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Home from './pages/Home';
import News from './pages/Home/News';
import Chat from './pages/Home/Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Layout이 적용되는 라우트 그룹 */}
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/news"
        element={
          <Layout>
            <News />
          </Layout>
        }
      />

      <Route
        path="/chat"
        element={
          <Layout>
            <Chat />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
