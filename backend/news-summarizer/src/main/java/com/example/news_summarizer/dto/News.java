package com.example.news_summarizer.dto;

public class News {
    private String title;
    private String content;
    private String thumbnailUrl;

    public News(String title, String content, String thumbnailUrl) {
        this.title = title;
        this.content = content;
        this.thumbnailUrl = thumbnailUrl;
    }

    // Getters
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getThumbnailUrl() { return thumbnailUrl; }
}
