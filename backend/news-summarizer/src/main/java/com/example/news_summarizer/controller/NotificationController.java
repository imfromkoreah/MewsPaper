package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.FcmTokenRequest;
import com.example.news_summarizer.service.NotificationSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    private final NotificationSettingService settingService;

    public NotificationController(NotificationSettingService settingService) {
        this.settingService = settingService;
    }

    /**
     * 클라이언트로부터 FCM 토큰을 받아 DB에 저장하는 엔드포인트
     * * (보안 참고: 실제 서비스에서는 요청 본문에서 userId를 받기보다, 
     * 인증된 사용자 세션 또는 JWT 토큰에서 userId를 추출해야 합니다.)
     */
    @PostMapping("/token")
    public ResponseEntity<String> saveFcmToken(@RequestBody FcmTokenRequest request) {
        
        if (request.getUserId() == null || request.getFcmToken() == null || request.getFcmToken().isEmpty()) {
            return ResponseEntity.badRequest().body("userId와 fcmToken이 모두 필요합니다.");
        }

        try {
            // 서비스 레이어의 토큰 업데이트 로직 호출
            settingService.updateFcmToken(request.getUserId(), request.getFcmToken());
            
            return ResponseEntity.ok("FCM 토큰이 성공적으로 등록 및 업데이트되었습니다.");
            
        } catch (Exception e) {
            // 로깅 및 상세 오류 처리
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("토큰 저장 중 서버 오류가 발생했습니다.");
        }
    }
}