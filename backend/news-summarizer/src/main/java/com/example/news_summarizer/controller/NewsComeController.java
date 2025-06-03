package com.example.news_summarizer.controller;
import org.springframework.web.bind.annotation.*;

import com.example.news_summarizer.dto.News;
import com.example.news_summarizer.repository.NewsRepository;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:5173") 
public class NewsComeController {

    private final NewsRepository newsRepository;

    public NewsComeController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @GetMapping
    public List<News> getNewsByCategory(@RequestParam("categoryId") int categoryId) {
        return newsRepository.findTop10ByCategoryIdOrderByPublishedDateDesc(categoryId)
                .stream()
                .map(news -> new News(
                        news.getTitle(),
                        news.getContent(),
                        news.getThumbnailUrl()
                ))
                .collect(Collectors.toList());
    }
}
