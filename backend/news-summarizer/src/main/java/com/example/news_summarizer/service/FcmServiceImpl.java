package com.example.news_summarizer.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service // 이전에 @Service를 추가하셨는지 다시 한번 확인하세요.
public class FcmServiceImpl implements FcmService {

    private final FirebaseMessaging firebaseMessaging;

    @Autowired
    public FcmServiceImpl(FirebaseMessaging firebaseMessaging) {
        // Spring이 위에서 정의한 FirebaseMessaging 빈을 주입합니다.
        this.firebaseMessaging = firebaseMessaging;
    }

    /**
     * 특정 사용자에게 알림을 전송합니다.
     * @param token 알림을 받을 사용자의 FCM 토큰
     * @param title 알림 제목
     * @param body 알림 내용
     */
    @Override
    public void sendNotification(String token, String title, String body) {
        
        // 1. Notification 객체 생성
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        // 2. Message 객체 생성 (전송할 메시지 본체)
        Message message = Message.builder()
                .setToken(token) // 알림을 받을 사용자의 토큰 지정
                .setNotification(notification)
                // .putData("key", "value") // 필요하다면 데이터 페이로드 추가
                .build();

        try {
            // 3. FirebaseMessaging을 사용하여 알림 전송
            String response = firebaseMessaging.send(message);
            System.out.println("FCM 알림 성공적으로 전송: " + response);
            
        } catch (Exception e) {
            System.err.println("FCM 알림 전송 실패 (토큰: " + token + "): " + e.getMessage());
            // 실제 서비스에서는 실패 로그 기록 및 예외 처리 로직이 필요합니다.
        }
    }
}