package com.example.news_summarizer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_read_history") // DB 테이블 이름은 그대로
public class UserScrap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "news_article_unique_link")
    private String newsArticleUniqueLink;

    @Column(name = "read_at") // DB 컬럼명은 그대로지만, 의미는 스크랩 시각
    private LocalDateTime scrapAt;

    // Getter / Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNewsArticleUniqueLink() { return newsArticleUniqueLink; }
    public void setNewsArticleUniqueLink(String newsArticleUniqueLink) { this.newsArticleUniqueLink = newsArticleUniqueLink; }

    public LocalDateTime getScrapAt() { return scrapAt; }
    public void setScrapAt(LocalDateTime scrapAt) { this.scrapAt = scrapAt; }
}
