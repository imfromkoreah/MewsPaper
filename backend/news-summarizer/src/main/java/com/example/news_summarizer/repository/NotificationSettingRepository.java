// src/main/java/com/example/news_summarizer/repository/NotificationSettingRepository.java
package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, Long> {
    void deleteByUserId(Long userId); // 특정 사용자의 모든 알림 설정 삭제
    List<NotificationSetting> findByUserId(Long userId); // 특정 사용자의 알림 설정 조회
}