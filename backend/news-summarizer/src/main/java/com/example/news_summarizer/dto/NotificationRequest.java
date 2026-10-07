// src/main/java/com/example/news_summarizer/dto/NotificationRequest.java
package com.example.news_summarizer.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    private String notificationType; // "출근", "퇴근" 등
    private String notificationTime; // "HH:MM" 형식 (예: "08:00")
}