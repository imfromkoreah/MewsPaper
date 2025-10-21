package com.example.news_summarizer.controller;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.service.NewsLetterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/newsletter")
public class NewsLetterController {

    private final NewsLetterService newsLetterService;

    public NewsLetterController(NewsLetterService newsLetterService) {
        this.newsLetterService = newsLetterService;
    }

    // 예: GET /api/newsletter/user/1
    @GetMapping("/user/{userId}")
    public List<News> getNewsForUser(@PathVariable Long userId) {
        return newsLetterService.getNewsForUser(userId);
    }
}
