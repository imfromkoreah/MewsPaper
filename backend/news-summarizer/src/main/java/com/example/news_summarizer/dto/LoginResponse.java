package com.example.news_summarizer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString; // 추가

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor // 이 어노테이션이 모든 필드를 인자로 받는 생성자를 자동으로 생성해줍니다.
@ToString // 추가: 디버깅에 유용
public class LoginResponse {
    private boolean success;
    private String message;
    private UserData user; // 사용자 정보
    private String redirectUrl; // <-- 이 필드를 추가합니다.

    // 내부 클래스 UserData (이전과 동일)
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString // 추가
    public static class UserData {
        private Long id;
        private String name;
        private String nickname;
        private String email; // <-- 이 필드가 있는지 확인 (없다면 추가)
        private String socialProvider; // enum 대신 String으로 반환
        private String socialId;
    }
}