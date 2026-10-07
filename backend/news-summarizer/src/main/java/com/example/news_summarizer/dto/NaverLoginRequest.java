package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverLoginRequest {
    private String code;
    private String state;
}