package com.example.news_summarizer.controller;

import com.example.news_summarizer.service.SearchSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SearchSummaryController {

    private final SearchSummaryService searchSummaryService;

    @GetMapping
    public ResponseEntity<?> getSummary(@RequestParam String userId, @RequestParam String keyword) {
        return searchSummaryService.getSummaryByUserIdAndKeyword(userId, keyword)
                .map(summary -> ResponseEntity.ok(summary))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

