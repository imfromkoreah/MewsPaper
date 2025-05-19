import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Layout from './components/Layout'; // Layout 파일 위치에 맞게 경로 조정
import Home from './pages/Home'  // Home도 import

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

    </Routes>
  );
}

export default App
