package com.example.news_summarizer.repository;

import  com.example.news_summarizer.entity.UserPreference;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    // 특정 userId에 해당하는 모든 UserPreference를 삭제합니다.
    void deleteByUserId(Long userId);
    List<UserPreference> findByUserId(Long userId);
}