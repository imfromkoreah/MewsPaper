package com.example.news_summarizer.controller;

import com.example.news_summarizer.service.NewsSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news/summary")
@RequiredArgsConstructor
public class NewsSummaryController {

    private final NewsSummaryService newsSummaryService;

    /** ✅ 카테고리별 / 전체 / 특정 기사 요약 실행 */
    @PostMapping("/generate")
    public ResponseEntity<String> generateSummaries(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String link) {

        if (link != null) {
            newsSummaryService.summarizeSingleNews(link);
            return ResponseEntity.ok("✅ 단일 기사 요약 완료: " + link);
        } else if (categoryId != null) {
            newsSummaryService.summarizeByCategory(categoryId);
            return ResponseEntity.ok("✅ 카테고리 " + categoryId + " 요약 완료");
        } else {
            newsSummaryService.summarizeAllNews();
            return ResponseEntity.ok("✅ 전체 뉴스 요약 완료");
        }
    }
}
