package com.example.news_summarizer.service;

public interface FcmService {

    /**
     * 특정 사용자에게 알림을 전송합니다.
     * * @param token 알림을 받을 사용자의 FCM 토큰
     * @param title 알림 제목
     * @param body 알림 내용
     */

    void sendNotification(String token, String title, String body);
    
    // 필요에 따라 데이터 메시지 전송 등의 다른 메서드를 추가할 수 있습니다.
}
