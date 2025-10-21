package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.entity.UserPreference;
import com.example.news_summarizer.repository.NewsRepository;
import com.example.news_summarizer.repository.UserPreferenceRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsLetterService {

    private final UserPreferenceRepository userPreferenceRepository;
    private final NewsRepository newsArticleRepository;

    public NewsLetterService(UserPreferenceRepository userPreferenceRepository,
                             NewsRepository newsArticleRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public List<News> getNewsForUser(Long userId) {
        // 1. 사용자 선호도 조회
        List<UserPreference> prefs = userPreferenceRepository.findByUserId(userId);

        // 2. 선호 키 → 카테고리 ID 매핑
        Map<String, Integer> categoryMap = Map.of(
            "POLITICS", 100,
            "ECONOMY", 101,
            "SOCIETY", 102,
            "LIFESTYLE_CULTURE", 103,
            "WORLD", 104,
            "IT_SCIENCE", 105
        );

        // 3. 선호 카테고리 ID 리스트 생성
        List<String> preferredKeys = prefs.stream()
                .map(UserPreference::getPreferenceKey)
                .collect(Collectors.toList());

        if(preferredKeys.isEmpty()) {
            return Collections.emptyList();
        }

        // 4. 뉴스 아티클 필터링 후 카테고리별 최대 2개 제한
        Map<String, List<News>> newsByCategory = new LinkedHashMap<>();
        for (String key : preferredKeys) {
            Integer catId = categoryMap.get(key);
            if (catId == null) continue;

            List<News> filtered = newsArticleRepository.findAll().stream()
                    .filter(n -> n.getCategoryId().equals(catId))
                    .limit(2) // 카테고리별 최대 2개
                    .collect(Collectors.toList());

            if (!filtered.isEmpty()) {
                newsByCategory.put(key, filtered);
            }
        }

        // 5. 순서대로 합치기
        return newsByCategory.values().stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }
}
