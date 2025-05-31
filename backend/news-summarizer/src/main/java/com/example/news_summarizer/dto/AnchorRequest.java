package com.example.news_summarizer.dto;

public class AnchorRequest {
    private Long userId;
    private String nickname;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
