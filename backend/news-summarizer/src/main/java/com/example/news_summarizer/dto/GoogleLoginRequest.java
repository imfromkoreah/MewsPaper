package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor // Lombok: 기본 생성자 자동 생성
@ToString // Lombok: toString() 메서드 자동 생성 (로그 확인 용이)
public class GoogleLoginRequest {
    private String code;  // Google 인증 코드를 받기 위한 필드
    private String state; // CSRF 방지 및 상태 유지를 위한 필드
}