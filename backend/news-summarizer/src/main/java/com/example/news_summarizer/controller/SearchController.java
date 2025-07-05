package com.example.news_summarizer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/search")

public class SearchController {
    @PostMapping("/news")
    public ResponseEntity<String> searchNews(@RequestBody Map<String, Object> payload) {
        String keyword = (String) payload.get("keyword");
        String userId = (String) payload.get("userId");
        System.out.println("검색 키워드: " + keyword);
        System.out.println("사용자 ID: " + userId);
        return ResponseEntity.ok("검색 요청 받음, 검색어: " + keyword);
    }
}
