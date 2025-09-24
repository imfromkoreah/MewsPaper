package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.NewsDTO;
import com.example.news_summarizer.service.NewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // 카테고리별 Top 10 뉴스 조회
    @GetMapping
    public List<NewsDTO> getNewsByCategory(@RequestParam("categoryId") int categoryId) {
        return newsService.getNewsByCategory(categoryId)
                .stream()
                .map(NewsDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 뉴스 상세 조회
    @GetMapping("/detail")
    public NewsDTO getNewsDetail(@RequestParam("link") String uniqueLink) {
        return newsService.getNewsByUniqueLink(uniqueLink)
                .map(NewsDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("뉴스를 찾을 수 없습니다."));
    }
}
