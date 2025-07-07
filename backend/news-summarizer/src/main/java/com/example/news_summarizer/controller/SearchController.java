package com.example.news_summarizer.controller;

import com.example.news_summarizer.entity.SearchNews;
import com.example.news_summarizer.service.SearchNewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchNewsService searchNewsService;

    public SearchController(SearchNewsService searchNewsService) {
        this.searchNewsService = searchNewsService;
    }

    // 기존 POST - 뉴스 검색 및 저장
    @PostMapping("/news")
    public ResponseEntity<String> searchNews(@RequestBody Map<String, String> payload) {
        String keyword = payload.get("keyword");
        String userId = payload.get("userId");
        if (keyword == null || userId == null) {
            return ResponseEntity.badRequest().body("keyword 또는 userId가 없습니다.");
        }

        searchNewsService.searchAndSaveNews(keyword, userId);
        return ResponseEntity.ok("뉴스 검색 및 저장 요청 완료: " + keyword);
    }

    // 추가: GET - 저장된 뉴스 목록 반환 (키워드로 조회)
    @GetMapping("/news")
    public ResponseEntity<List<SearchNews>> getNewsByKeyword(@RequestParam String keyword) {
        List<SearchNews> newsList = searchNewsService.getNewsByKeyword(keyword);
        return ResponseEntity.ok(newsList);
    }
}
