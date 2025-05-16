// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" />} />
      <Route path="/onboarding" element={<Onboarding />} />
      {/* 나중에 <Route path="/home" element={<Home />} /> 이런 식으로 홈 추가 */}
    </Routes>
  )
}

export default App
