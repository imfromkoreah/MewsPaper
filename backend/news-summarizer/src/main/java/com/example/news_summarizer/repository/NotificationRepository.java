package com.example.news_summarizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.news_summarizer.entity.NotificationSetting;

import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
/**
 * 알림 설정 정보(NotificationSettings)에 접근하기 위한 Spring Data JPA Repository입니다.
 */
@Repository
public interface NotificationRepository extends JpaRepository<NotificationSetting, Long> {

    /**
     * 특정 알림 시간(LocalTime)과 일치하는 모든 알림 설정을 조회합니다.
     * * 주의: 데이터베이스에 따라 LocalTime 비교 방식이 다를 수 있습니다.
     * 아래 쿼리는 LocalTime 필드가 시:분:초를 모두 포함할 경우를 가정합니다.
     * Scheduler에서 LocalTime.now().withSecond(0).withNano(0)를 사용하므로, 
     * DB의 time 필드도 시:분만 유효한 값으로 저장되어야 정확히 매칭됩니다.
     */
    List<NotificationSetting> findByNotificationTime(LocalTime notificationTime);
    List<NotificationSetting> findByNotificationTimeAndIsActiveTrue(Time notificationTime);

}