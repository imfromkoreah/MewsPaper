// src/main/java/com/example/news_summarizer/repository/NotificationSettingRepository.java
package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.util.List;

@Repository
public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, Long> {
    void deleteByUserId(Long userId); // 특정 사용자의 모든 알림 설정 삭제
    List<NotificationSetting> findByUserId(Long userId); // 특정 사용자의 알림 설정 조회
    // 특정 시간에 활성화된 알림 설정을 모두 조회하는 쿼리// 💡 findBy 뒤의 필드 이름을 'NotificationTime'으로 변경합니다.
    List<NotificationSetting> findByNotificationTimeAndIsActive(Time notificationTime, Boolean isActive);
}