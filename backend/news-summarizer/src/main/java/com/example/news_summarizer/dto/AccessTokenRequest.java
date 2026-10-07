package com.example.news_summarizer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AccessTokenRequest {
    private String accessToken; // 프론트엔드로부터 받을 액세스 토큰만 포함
}