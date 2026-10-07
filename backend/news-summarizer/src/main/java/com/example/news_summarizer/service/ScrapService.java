package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.entity.UserScrap;
import com.example.news_summarizer.repository.NewsRepository;
import com.example.news_summarizer.repository.UserScrapRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScrapService {

    private final UserScrapRepository userScrapRepository;
    private final NewsRepository newsRepository;

    public ScrapService(UserScrapRepository userScrapRepository, NewsRepository newsRepository) {
        this.userScrapRepository = userScrapRepository;
        this.newsRepository = newsRepository;
    }

    // 스크랩 추가
    public void addScrap(Long userId, String uniqueLink) {
        boolean exists = userScrapRepository.existsByUserIdAndNewsArticleUniqueLink(userId, uniqueLink);
        if (exists) return; // 이미 스크랩된 뉴스면 그냥 리턴

        UserScrap scrap = new UserScrap();
        scrap.setUserId(userId);
        scrap.setNewsArticleUniqueLink(uniqueLink);
        scrap.setScrapAt(LocalDateTime.now());
        userScrapRepository.save(scrap);
    }

    // 스크랩 목록 조회
    public List<News> getScrapList(Long userId) {
        List<UserScrap> scraps = userScrapRepository.findByUserId(userId);

        return scraps.stream()
                .map(s -> newsRepository.findById(s.getNewsArticleUniqueLink()).orElse(null))
                .filter(n -> n != null)
                .collect(Collectors.toList());
    }

    // 스크랩 삭제
    public void removeScrap(Long userId, String uniqueLink) {
        userScrapRepository.findByUserId(userId).stream()
                .filter(s -> s.getNewsArticleUniqueLink().equals(uniqueLink))
                .forEach(userScrapRepository::delete);
    }
}
