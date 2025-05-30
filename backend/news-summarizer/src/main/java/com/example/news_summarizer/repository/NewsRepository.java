package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, String> {
    boolean existsByUrl(String url);
}
