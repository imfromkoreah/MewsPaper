package com.example.news_summarizer.service;

import com.example.news_summarizer.dto.*;
import com.example.news_summarizer.entity.*;
import com.example.news_summarizer.repository.*; // User Repository 사용

import java.sql.Time;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final NotificationSettingRepository notificationSettingRepository;

    private final LoginRepository loginRepository; // User 엔티티를 다루는 리포지토리

    public UserService(LoginRepository loginRepository, NotificationSettingRepository notificationSettingRepository) {
        this.loginRepository = loginRepository;
        this.notificationSettingRepository = notificationSettingRepository;
    }

    @Transactional // 트랜잭션으로 묶어 데이터 일관성 보장
    public User updateNickname(Long id, String newNickname) {
        User user = loginRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id: " + id));

        // 닉네임 업데이트
        user.setNickname(newNickname);

        return loginRepository.save(user);
    }

    @Transactional // <--- 새로 추가된 알림 설정 저장 메서드
    public List<NotificationSetting> saveUserNotifications(Long id, List<NotificationRequest> notificationRequests) {
        // 1. socialId와 socialProvider로 사용자 ID를 찾습니다.
        User user = loginRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 해당 사용자의 기존 알림 설정을 모두 삭제합니다. (선택된 것만 저장하기 위함)
        notificationSettingRepository.deleteByUserId(user.getId());

        // 3. 받은 NotificationRequest 리스트를 NotificationSetting 엔티티로 변환하여 저장합니다.
        List<NotificationSetting> newNotifications = notificationRequests.stream().map(req -> {
            NotificationSetting notification = new NotificationSetting();
            notification.setUserId(user.getId()); // 사용자 ID 설정
            notification.setNotificationType(req.getNotificationType());
            notification.setNotificationTime(Time.valueOf(req.getNotificationTime() + ":00")); // "HH:MM" -> "HH:MM:00" 변환
            notification.setIsActive(true); // 기본적으로 활성화
            return notification;
        }).collect(Collectors.toList());

        return notificationSettingRepository.saveAll(newNotifications); // 모든 알림 설정 저장
    }
}