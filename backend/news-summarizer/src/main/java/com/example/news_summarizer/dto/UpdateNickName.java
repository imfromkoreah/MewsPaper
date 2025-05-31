package com.example.news_summarizer.dto;

import com.example.news_summarizer.entity.SocialProvider;

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
public class UpdateNickName {
    private Long id; // 사용자를 식별할 소셜 ID
    private String nickname; // 업데이트할 닉네임
}