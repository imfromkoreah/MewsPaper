package com.example.news_summarizer.dto;

import com.example.news_summarizer.entity.News;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO {
    private String uniqueLink;
    private String title;
    private String content;
    private String thumbnailUrl;
    private String source; // 추가
    private String publishedDate; // 추가
    private String url; // 추가

    public static NewsDTO fromEntity(News entity) {
        return new NewsDTO(
            entity.getUniqueLink(),
            entity.getTitle(),
            entity.getContent(),
            entity.getThumbnailUrl(),
            entity.getSource(), // 추가
            entity.getPublishedDate(), // 추가
            entity.getUrl() // 추가
        );
    }
}