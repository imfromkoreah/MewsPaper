// frontend/vite.config.ts

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // 1. 현재 모드에 해당하는 환경 변수 로드
    const env = loadEnv(mode, process.cwd(), '');

    // 2. Service Worker (firebase-messaging-sw.js)에서 사용할 Firebase 설정 객체를 구성
    const firebaseConfigForSw = {
        VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
        VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
        VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
        VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID,
    };
    
    return {
        plugins: [react()],
        
        // 3. define 설정을 통해 환경 변수 치환
        define: {
            // Service Worker가 접근할 수 있는 전역 상수 'FCM_CONFIG' 정의
            'FCM_CONFIG': JSON.stringify(firebaseConfigForSw),
            // useNaverLogin.ts에서 사용할 VAPID_KEY도 명시적으로 치환 (Service Worker와 무관하나 안전성 확보)
            'FCM_VAPID_KEY': JSON.stringify(env.VITE_FIREBASE_VAPID_KEY),
        },
        
        // 4. 서버 및 프록시 설정
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080', // Spring Boot 백엔드 주소
                    changeOrigin: true,
                },
            },
        },
    };
});