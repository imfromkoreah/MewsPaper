package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.SearchSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SearchSummaryRepository extends JpaRepository<SearchSummary, Long> {
    Optional<SearchSummary> findByUserIdAndKeyword(String userId, String keyword);
}
