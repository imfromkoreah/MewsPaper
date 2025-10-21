package com.example.news_summarizer.dto;

import com.example.news_summarizer.entity.News;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsDTO {
    private String uniqueLink;
    private String title;
    private String content;
    private String summary; // ✅ 요약문 필드 추가
    private Integer categoryId;
    private String url;
    private String thumbnailUrl;
    private String publishedDate;

    public static NewsDTO fromEntity(News news) {
        return NewsDTO.builder()
                .uniqueLink(news.getUniqueLink())
                .title(news.getTitle())
                .content(news.getContent())
                .summary(news.getSummary()) // ✅ 요약 매핑 필수!!
                .categoryId(news.getCategoryId())
                .url(news.getUrl())
                .thumbnailUrl(news.getThumbnailUrl())
                .publishedDate(news.getPublishedDate())
                .build();
    }
}
