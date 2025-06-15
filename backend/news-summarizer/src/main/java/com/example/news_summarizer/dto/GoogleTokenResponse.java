package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString; // 필요하다면 추가

@Getter
@Setter
@ToString // 로그를 찍을 때 객체 내용을 보기 쉽게 합니다.
public class GoogleTokenResponse {
    private String access_token;
    private Long expires_in;
    private String scope;
    private String token_type;
    private String id_token; // 사용자 정보가 담겨있는 JWT (필요시 파싱)
    private String refresh_token; // 오프라인 액세스 시 발급 (최초 로그인 시)
}