package com.example.news_summarizer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // Lombok: Getter 메소드 자동 생성
@Setter // Lombok: Setter 메소드 자동 생성
@NoArgsConstructor // Lombok: 기본 생성자 자동 생성
@AllArgsConstructor // Lombok: 모든 필드를 인자로 받는 생성자 자동 생성
public class UserAttendanceResponse {
    private boolean success; // 요청 성공 여부 (true/false)
    private String message; // 사용자에게 보여줄 메시지 (예: "출석 성공!", "이미 출석했습니다.")
    private Object data; // ⭐ 추가: 필요한 경우 데이터를 담을 수 있는 필드

    // 메시지만 있는 생성자 (편의용)
    public UserAttendanceResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }
}
