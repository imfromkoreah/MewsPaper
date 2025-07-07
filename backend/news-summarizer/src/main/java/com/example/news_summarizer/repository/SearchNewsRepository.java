package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.SearchNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchNewsRepository extends JpaRepository<SearchNews, Long> {
    boolean existsByUniqueLink(String uniqueLink);

    // 키워드로 뉴스 리스트 조회
    List<SearchNews> findByKeywordOrderByPublishedDateDesc(String keyword);
}
