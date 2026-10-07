// src/main/java/com/example/news_summarizer/component/NotificationScheduler.java

package com.example.news_summarizer.component;

import com.example.news_summarizer.repository.NotificationRepository;
import com.example.news_summarizer.repository.NotificationSettingRepository;
import com.example.news_summarizer.service.FcmService; // 💡 이제 이 경로의 FcmService를 사용합니다.
import com.example.news_summarizer.entity.NotificationSetting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Time;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * 사용자 설정 시간에 맞춰 알림을 전송하는 스케줄러 컴포넌트입니다.
 * Spring Data JPA Repository와 FcmService에 의존합니다.
 */
@Component
public class NotificationScheduler {
    
    private final NotificationSettingRepository settingRepository;
    private final FcmService fcmService;

    public NotificationScheduler(NotificationSettingRepository settingRepository, FcmService fcmService) {
        this.settingRepository = settingRepository;
        this.fcmService = fcmService;
    }

    /**
     * 알림 전송 스케줄링 메서드
     * cron = "0 * * * * *" : 매분 0초마다 실행 (즉, 매분 정각)
     * 이 스케줄은 DB의 HH:MM:SS 중 초(SS) 부분을 무시하고 분(MM)까지만 비교합니다.
     */
    @Scheduled(cron = "0 * * * * *") 
    public void sendScheduledNotifications() {
        // 1. 현재 시각을 시(HH)와 분(MM)까지만 가져옵니다. (초는 0으로 설정)
        // DB의 ctrl_time이 HH:MM:SS 형식이지만, 매분 정각에만 스케줄이 실행되므로,
        // 현재 시각의 초를 0으로 맞추어 DB의 시간과 일치시킵니다.
        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        // 2. LocalTime을 DB 조회에 필요한 java.sql.Time 객체로 변환합니다.
        Time currentTime = Time.valueOf(now);
        System.out.println("스케줄러 실행: 현재 시간 " + currentTime);

  // 3. Repository 호출 시 메서드와 타입 이름을 일치시킵니다.
        List<NotificationSetting> settingsToNotify = 
            settingRepository.findByNotificationTimeAndIsActive(currentTime, true); // Boolean true 사용
            
        if (settingsToNotify.isEmpty()) {
            return;
        }

        // 3. 조회된 각 설정에 따라 알림을 전송합니다.
        for (NotificationSetting setting : settingsToNotify) {
            
            String token = setting.getFcmToken();

            // fcm_token이 NULL이거나 비어있으면 알림을 건너뜁니다. (이미지에서 많은 행이 NULL이었습니다!)
            if (token == null || token.isEmpty()) {
                System.out.println("User ID: " + setting.getUserId() + "의 토큰이 없어 알림을 건너뜁니다.");
                continue;
            }

            // 알림 내용 정의
            String title = "📰 " + setting.getNotificationType() + " 알림입니다.";
            String body = "매일 " + currentTime + "에 요청하신 최신 뉴스 요약이 준비되었습니다. 앱에서 확인하세요!";

            // FcmService를 사용하여 알림 전송
            fcmService.sendNotification(token, title, body);
        }
    }
}