package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.UserScrap;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserScrapRepository extends JpaRepository<UserScrap, Long> {
    boolean existsByUserIdAndNewsArticleUniqueLink(Long userId, String uniqueLink);
    List<UserScrap> findByUserId(Long userId);
}