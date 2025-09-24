package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<News> getNewsByCategory(int categoryId) {
        return newsRepository.findTop10ByCategoryIdOrderByPublishedDateDesc(categoryId);
    }

    public Optional<News> getNewsByUniqueLink(String uniqueLink) {
        return newsRepository.findById(uniqueLink);
    }
}
