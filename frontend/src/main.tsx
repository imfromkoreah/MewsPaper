import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './firebase.ts'; // 이 파일 안에 initializeApp()이 포함되어야 합니다.
import { BrowserRouter } from 'react-router-dom';
// ✅ Firebase FCM Service Worker 등록
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js', { type: 'module' }) // ⚠️ type: 'module' 중요!
    .then((registration) => {
      console.log('✅ Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('❌ Service Worker registration failed:', error);
    });
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
