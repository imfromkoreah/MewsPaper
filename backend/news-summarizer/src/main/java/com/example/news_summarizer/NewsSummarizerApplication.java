package com.example.news_summarizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling // Spring에게 스케줄링 작업을 활성화하라고 지시합니다.
@SpringBootApplication
@EnableAsync  // @Async 애노테이션이 붙은 메서드들이 비동기로 동작
public class NewsSummarizerApplication {
	public static void main(String[] args) {
		SpringApplication.run(NewsSummarizerApplication.class, args);
	}
}
