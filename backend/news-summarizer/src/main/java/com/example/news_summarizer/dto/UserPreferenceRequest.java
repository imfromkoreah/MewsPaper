package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceRequest {
    private String userId; // 클라이언트에서 문자열로 넘어올 수 있으므로 String으로 받음
    private List<String> preferences; // 선택된 관심사의 키 리스트 (예: ["POLITICS", "IT_SCIENCE"])
}