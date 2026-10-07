package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.Setter;

// Lombok을 사용하지 않는다면 Getter/Setter를 직접 구현해야 합니다.
@Getter
@Setter
public class FcmTokenRequest {
    
    // 알림 설정을 업데이트할 사용자의 ID (인증을 통해 얻거나, 요청 본문에 포함)
    private Long userId; 
    
    // 클라이언트 앱에서 받은 FCM 토큰 문자열
    private String fcmToken;
}