package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.repository.NewsRepository;
import com.theokanning.openai.completion.chat.*;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
public class NewsSummaryService {

    private final NewsRepository newsRepository;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private OpenAiService openAiService;

    @PostConstruct
    public void init() {
        openAiService = new OpenAiService(openAiApiKey, Duration.ofSeconds(60));
    }

    /** ✅ 1. 카테고리별 뉴스 10개 동시 요약 */
    public void summarizeByCategory(int categoryId) {
        List<News> articles = newsRepository.findTop10ByCategoryIdOrderByPublishedDateDesc(categoryId);
        summarizeInParallel(articles);
    }

    /** ✅ 2. 전체 뉴스 중 요약 안 된 것만 */
    public void summarizeAllNews() {
        List<News> unsummarized = newsRepository.findAll()
                .stream()
                .filter(n -> n.getSummary() == null || n.getSummary().isBlank())
                .toList();
        summarizeInParallel(unsummarized);
    }

    /** ✅ 3. 특정 기사 하나만 */
    public void summarizeSingleNews(String uniqueLink) {
        newsRepository.findById(uniqueLink).ifPresent(this::summarizeAndSave);
    }

    /** ✅ 4. 병렬 처리 로직 (ExecutorService 사용) */
    private void summarizeInParallel(List<News> articles) {
        if (articles.isEmpty()) {
            System.out.println("요약할 뉴스가 없습니다.");
            return;
        }

        ExecutorService executor = Executors.newFixedThreadPool(5); // 동시 5개
        for (News news : articles) {
            executor.submit(() -> summarizeAndSave(news));
        }

        executor.shutdown();
        try {
            executor.awaitTermination(15, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("요약 작업 중단됨: " + e.getMessage());
        }
    }

    /** ✅ 5. 개별 뉴스 요약 + 저장 */
    private void summarizeAndSave(News news) {
        try {
            if (news.getSummary() != null && !news.getSummary().isBlank()) return;

            String summary = generateSummary(news.getTitle(), news.getContent());
            news.setSummary(summary);
            newsRepository.save(news);
            System.out.println("✅ 요약 완료: " + news.getTitle());
        } catch (Exception e) {
            System.err.println("❌ 요약 실패 (" + news.getTitle() + "): " + e.getMessage());
        }
    }

    /** ✅ 6. GPT 요청 */
    private String generateSummary(String title, String content) {
        String prompt = "다음 뉴스 기사를 세 문장 이내로 자연스럽게 요약해 줘.\n" +
                "뉴스 제목: " + title + "\n" +
                "본문: " + content;

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(
                        new ChatMessage("system", "당신은 뉴스 요약 전문가입니다."),
                        new ChatMessage("user", prompt)
                ))
                .maxTokens(400)
                .build();

        return openAiService.createChatCompletion(request)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent()
                .trim();
    }
}
