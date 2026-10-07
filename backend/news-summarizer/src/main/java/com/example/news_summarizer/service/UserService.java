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

    private final LoginRepository loginRepository;
    private final NotificationSettingRepository notificationSettingRepository;

    public UserService(LoginRepository loginRepository, NotificationSettingRepository notificationSettingRepository) {
        this.loginRepository = loginRepository;
        this.notificationSettingRepository = notificationSettingRepository;
    }

    public User findById(Long id) {
        return loginRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateNickname(Long id, String newNickname) {
        User user = loginRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id: " + id));

        user.setNickname(newNickname);
        return loginRepository.save(user);
    }

    @Transactional
    public List<NotificationSetting> saveUserNotifications(Long id, List<NotificationRequest> notificationRequests) {
        User user = loginRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        notificationSettingRepository.deleteByUserId(user.getId());

        List<NotificationSetting> newNotifications = notificationRequests.stream().map(req -> {
            NotificationSetting notification = new NotificationSetting();
            notification.setUserId(user.getId());
            notification.setNotificationType(req.getNotificationType());
            notification.setNotificationTime(Time.valueOf(req.getNotificationTime() + ":00"));
            notification.setIsActive(true);
            return notification;
        }).collect(Collectors.toList());

        return notificationSettingRepository.saveAll(newNotifications);
    }
}
