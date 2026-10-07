package com.example.news_summarizer.controller;

import com.example.news_summarizer.entity.SearchNews;
import com.example.news_summarizer.service.SearchNewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SummarizeController {

    private final SearchNewsService searchNewsService;

    public SummarizeController(SearchNewsService searchNewsService) {
        this.searchNewsService = searchNewsService;
    }

    // 프론트에서 newsList 자체(List<SearchNews>)만 POST로 보내는 방식
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarizeNews(@RequestBody List<SearchNews> newsList) {
        if (newsList == null || newsList.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("summary", "요약할 뉴스가 없습니다."));
        }

        String summary = searchNewsService.summarizeArticles(newsList);
        return ResponseEntity.ok(Map.of("summary", summary));
    }
}
