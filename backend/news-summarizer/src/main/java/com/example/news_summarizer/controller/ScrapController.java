package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.NewsDTO;
import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.service.ScrapService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scrap")
@CrossOrigin(origins = "http://localhost:5173")
public class ScrapController {

    private final ScrapService scrapService;

    public ScrapController(ScrapService scrapService) {
        this.scrapService = scrapService;
    }

    // 스크랩 추가
    @PostMapping("/add")
    public ResponseEntity<String> addScrap(@RequestParam Long userId,
                                           @RequestParam String uniqueLink) {
        try {
            scrapService.addScrap(userId, uniqueLink);
            return ResponseEntity.ok("스크랩 추가 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("스크랩 추가 실패: " + e.getMessage());
        }
    }
    @GetMapping("/list")
    public ResponseEntity<List<NewsDTO>> getScrapList(@RequestParam Long userId) {
        try {
            // ScrapService에서 UserScrap → News 목록 가져오기
            List<News> newsList = scrapService.getScrapList(userId);

            // News → NewsDTO 변환
            List<NewsDTO> dtoList = newsList.stream()
                    .map(NewsDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // 스크랩 삭제
    @PostMapping("/remove")
    public ResponseEntity<String> removeScrap(@RequestParam Long userId,
                                              @RequestParam String uniqueLink) {
        try {
            scrapService.removeScrap(userId, uniqueLink);
            return ResponseEntity.ok("스크랩 삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("스크랩 삭제 실패: " + e.getMessage());
        }
    }
}

