// public/firebase-messaging-sw.js

// ✅ Firebase SDK (Service Worker 호환 버전)
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// ✅ Firebase 설정 (직접 값 넣기)
firebase.initializeApp({
  apiKey: "AIzaSyBTByoDvilj4-zvYbVFt82dEIb3DN2TYwY",
  authDomain: "mewspaper-baaf4.firebaseapp.com",
  projectId: "mewspaper-baaf4",
  storageBucket: "mewspaper-baaf4.firebasestorage.app",
  messagingSenderId: "702836300187",
  appId: "1:702836300187:web:f501bb88c416ab589c693e",
});

// ✅ FCM 인스턴스 생성
const messaging = firebase.messaging();

// ✅ 백그라운드 알림 처리
messaging.onBackgroundMessage((payload) => {
  console.log("📩 [firebase-messaging-sw.js] 백그라운드 메시지 수신:", payload);

  const notificationTitle = payload.notification?.title || "새 알림이 도착했습니다!";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
