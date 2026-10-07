package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.repository.NewsRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    // ✅ 영속성 컨텍스트(EntityManager) 주입 → 캐시 초기화용
    @PersistenceContext
    private EntityManager entityManager;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    /** ✅ 카테고리별 뉴스 10개 조회 (DB 최신 상태 반영) */
    @Transactional(readOnly = true)
    public List<News> getNewsByCategory(int categoryId) {
        // 매번 DB에서 최신 데이터 읽기
        entityManager.clear();
        return newsRepository.findTop10ByCategoryIdOrderByPublishedDateDesc(categoryId);
    }

    /** ✅ 특정 기사 상세 조회 (summary 최신 상태 반영) */
    @Transactional(readOnly = true)
    public Optional<News> getNewsByUniqueLink(String uniqueLink) {
        // 🧠 1차 캐시 비우기 → DB에서 직접 조회하도록 강제
        entityManager.clear();
        return newsRepository.findById(uniqueLink);
    }
}
