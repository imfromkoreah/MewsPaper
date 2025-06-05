package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.UserPreference;
import com.example.news_summarizer.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserPreferenceService {

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @Transactional // 삭제와 삽입을 하나의 트랜잭션으로 묶어 원자성을 보장합니다.
    public List<UserPreference> saveUserPreferences(Long userId, List<String> preferenceKeys) {
        // 1. 해당 사용자의 기존 관심사 설정을 모두 삭제합니다.
        userPreferenceRepository.deleteByUserId(userId);

        // 2. 새로운 관심사 키 리스트를 UserPreference 엔티티 리스트로 변환합니다.
        List<UserPreference> newUserPreferences = preferenceKeys.stream()
            .map(key -> new UserPreference(userId, key)) // preference_value는 "selected"로 고정
            .collect(Collectors.toList());

        // 3. 새로운 관심사 설정을 데이터베이스에 저장합니다.
        return userPreferenceRepository.saveAll(newUserPreferences);
    }

    // 필요하다면 특정 사용자의 관심사를 조회하는 메서드 등도 추가할 수 있습니다.
    public List<UserPreference> getUserPreferences(Long userId) {
        return userPreferenceRepository.findByUserId(userId); // 리포지토리에 이 메서드 추가 필요
    }
}