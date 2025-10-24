// 예시: NotificationService.java
package com.example.news_summarizer.service;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessagingException;
@Service
public class NotificationService {

    private final FirebaseMessaging firebaseMessaging;
    // ... (UserRepository 등 필요한 Repository 주입)

    public NotificationService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    /**
     * 특정 사용자에게 알림을 발송하는 메서드
     * @param userId 알림을 받을 사용자 ID
     * @param title 알림 제목
     * @param body 알림 내용
     */
    public void sendNotificationToUser(Long userId, String title, String body) {
        // 1. DB에서 해당 userId에 연결된 FCM Device Token을 조회
        String targetToken = findUserToken(userId); // 실제 DB 조회 로직 필요

        if (targetToken == null) {
            System.out.println("토큰 없음: 사용자 " + userId + "에게 알림을 보낼 수 없습니다.");
            return;
        }

        // 2. Notification 객체 생성
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        // 3. Message 객체 생성 (토큰과 알림 내용 결합)
        Message message = Message.builder()
                .setToken(targetToken)
                .setNotification(notification)
                .putData("key", "value") // 추가적인 데이터 페이로드 (선택 사항)
                .build();

        // 4. 알림 발송
        // try {
        //     //String response = firebaseMessaging.send(message);
        //     //System.out.println("Successfully sent message: " + response);
        // } catch (FirebaseMessagingException e) {
        //     System.err.println("Failed to send message: " + e.getMessage());
        // }
    }
    
    // ... (실제 DB에서 토큰을 찾아 반환하는 메서드)
    private String findUserToken(Long userId) {
        // 실제로는 DB에서 해당 사용자의 device token을 조회해야 함
        // 예시: return userRepository.findTokenByUserId(userId);
        return "YOUR_USER_DEVICE_TOKEN"; 
    }
}