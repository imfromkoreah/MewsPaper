import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";

// 환경 변수에서 Firebase 구성 정보를 로드
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// ✅ Firebase 앱 초기화
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("🔥 Firebase 앱이 새로 초기화되었습니다.");
} else {
  app = getApp();
  console.log("✅ Firebase 앱이 이미 초기화되어 있습니다.");
}

// ✅ 3️⃣ Service Worker 등록 추가
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js") // ✅ 반드시 절대경로로!
    .then((registration) => {
      console.log("✅ Firebase Service Worker 등록 성공:", registration.scope);
    })
    .catch((error) => {
      console.error("❌ Firebase Service Worker 등록 실패:", error);
    });
}

// 다른 곳에서 사용할 수 있게 export
export { app };
