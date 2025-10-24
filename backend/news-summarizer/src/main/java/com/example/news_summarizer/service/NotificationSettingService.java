package com.example.news_summarizer.service;

import com.example.news_summarizer.repository.NotificationSettingRepository;
import com.example.news_summarizer.entity.NotificationSetting;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationSettingService {

    private final NotificationSettingRepository settingRepository;

    public NotificationSettingService(NotificationSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    /**
     * 사용자의 모든 알림 설정 행에 FCM 토큰을 업데이트합니다.
     * (사용자별 알림 설정이 여러 개일 수 있으므로 List로 처리)
     * * @param userId 토큰을 저장할 사용자 ID
     * @param fcmToken 저장할 FCM 토큰
     */
    @Transactional
    public void updateFcmToken(Long userId, String fcmToken) {
        
        // 1. 해당 userId를 가진 모든 알림 설정 행을 찾습니다.
        //    (NotificationSettingRepository에 findByUserId 메서드가 있다고 가정)
        List<NotificationSetting> settings = settingRepository.findByUserId(userId);
        
        if (settings.isEmpty()) {
            // 알림 설정이 아직 없는 경우: 필요하다면 기본 설정 행을 생성하는 로직 추가
            // throw new ResourceNotFoundException("해당 사용자의 알림 설정이 없습니다.");
            System.out.println("사용자 ID: " + userId + "에 대한 알림 설정이 없습니다.");
            return; 
        }

        // 2. 찾아낸 모든 알림 설정 행의 fcmToken 값을 업데이트합니다.
        for (NotificationSetting setting : settings) {
            setting.setFcmToken(fcmToken);
            // setFcmToken은 NotificationSetting 엔티티에 정의된 Setter 메서드입니다.
        }

        // 3. 변경된 설정을 DB에 저장합니다. (@Transactional 덕분에 saveAll 없이도 플러시될 수 있지만 명시적 호출도 가능)
        settingRepository.saveAll(settings); 
        
        System.out.println("사용자 ID " + userId + "의 FCM 토큰이 성공적으로 업데이트되었습니다.");
    }
}