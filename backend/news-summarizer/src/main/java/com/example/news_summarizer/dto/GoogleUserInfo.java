package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString; // 필요하다면 추가

@Getter
@Setter
@ToString // 로그를 찍을 때 객체 내용을 보기 쉽게 합니다.
public class GoogleUserInfo {
    private String sub; // Google 사용자 고유 ID (이것으로 우리 서비스 사용자를 식별)
    private String name; // 사용자 이름 (ex: 홍길동)
    private String email;
    private Boolean email_verified; // 이메일 인증 여부
    private String locale; // 언어/지역
}