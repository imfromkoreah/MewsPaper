package com.example.news_summarizer.dto;

import com.example.news_summarizer.entity.News;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonProperty;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO {

    @JsonProperty("uniqueLink")
    private String uniqueLink;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("thumbnailUrl")
    private String thumbnailUrl;

    @JsonProperty("source")
    private String source;

    @JsonProperty("publishedDate")
    private String publishedDate;

    @JsonProperty("url")
    private String url;

    @JsonProperty("categoryId")   // ✅ 추가
    private Integer categoryId;

    // ✅ fromEntity 수정
    public static NewsDTO fromEntity(News entity) {
        return NewsDTO.builder()
                .uniqueLink(entity.getUniqueLink())
                .title(entity.getTitle())
                .content(entity.getContent())
                .thumbnailUrl(entity.getThumbnailUrl())
                .source(entity.getSource())
                .publishedDate(entity.getPublishedDate())
                .url(entity.getUrl())
                .categoryId(entity.getCategoryId()) // ✅ 매핑 추가
                .build();
    }
}
