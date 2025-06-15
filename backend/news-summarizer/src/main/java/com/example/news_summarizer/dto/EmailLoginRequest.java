package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor // Lombok: 기본 생성자 자동 생성
@ToString // Lombok: toString() 메서드 자동 생성 (로그 확인 용이)
public class EmailLoginRequest {
    private String email;
    private String password;
}
