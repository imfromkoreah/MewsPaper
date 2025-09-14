package com.example.news_summarizer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "news_search")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchNews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String keyword;

    @Column(name = "unique_link", nullable = false, unique = true)
    private String uniqueLink;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private String url;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    private String source;

    @Column(name = "published_date")
    private LocalDateTime publishedDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
