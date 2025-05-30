package com.example.news_summarizer.controller;

import com.example.news_summarizer.service.CrawlerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final CrawlerService crawlerService;

    public NewsController(CrawlerService crawlerService) {
        this.crawlerService = crawlerService;
    }

    @PostMapping("/crawl/{categoryId}")
    public ResponseEntity<String> crawl(@PathVariable String categoryId) {
        crawlerService.crawl(categoryId);
        return ResponseEntity.ok("카테고리 " + categoryId + " 크롤링 완료");
    }
}
