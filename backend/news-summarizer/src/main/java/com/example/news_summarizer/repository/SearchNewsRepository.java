package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.SearchNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable; // ✅ 이 import 문을 추가해야 합니다.

import java.util.List;

@Repository
public interface SearchNewsRepository extends JpaRepository<SearchNews, Long> {

    // uniqueLink 중복 체크용
    boolean existsByUniqueLink(String uniqueLink);

    // 키워드로 뉴스 리스트 전체 조회 (최신순)
    List<SearchNews> findByKeywordOrderByPublishedDateDesc(String keyword);

    // 키워드로 뉴스 최대 5개만 최신순 조회 (요약용)
    List<SearchNews> findTop5ByKeywordOrderByPublishedDateDesc(String keyword);

    // ✅ 추가해야 할 메서드: Pageable을 이용해 페이징 처리된 뉴스 리스트를 조회합니다.
    List<SearchNews> findByKeywordOrderByPublishedDateDesc(String keyword, Pageable pageable);
}