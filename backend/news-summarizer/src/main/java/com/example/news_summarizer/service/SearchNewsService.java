package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.SearchNews;
import com.example.news_summarizer.repository.SearchNewsRepository;
import com.example.news_summarizer.service.SearchSummaryService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.OpenAiHttpException; // Added for OpenAI HTTP exceptions
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit; // Added for TimeUnit

@Service
public class SearchNewsService {

    private final SearchNewsRepository searchNewsRepository;
    private final SearchSummaryService searchSummaryService;

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    private OpenAiService openAiService;

    public SearchNewsService(SearchNewsRepository searchNewsRepository,
                             SearchSummaryService searchSummaryService) {
        this.searchNewsRepository = searchNewsRepository;
        this.searchSummaryService = searchSummaryService;
    }

    @PostConstruct
    public void init() {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            System.out.println("OpenAI API 키가 주입되지 않았습니다!");
        } else {
            System.out.println("OpenAI API 키가 정상적으로 주입되었습니다. (길이: " + openAiApiKey.length() + ")");
            openAiService = new OpenAiService(openAiApiKey);
        }
    }

    public void searchAndSaveNews(String keyword, String userId) {
        try {
            System.out.println("[1단계] 네이버 뉴스 링크 검색 시작: " + keyword);
            Set<String> links = searchNewsLinks(keyword);
            System.out.println("[1단계 완료] 검색된 링크 개수: " + links.size());

            for (String link : links) {
                String uniqueLink = extractUniqueLink(link);
                if (uniqueLink != null && !searchNewsRepository.existsByUniqueLink(uniqueLink)) {
                    try {
                        System.out.println("[2단계] 기사 크롤링 및 저장 시도: " + link);
                        processAndSaveArticle(uniqueLink, link, keyword, userId);
                        System.out.println("[2단계 완료] 기사 저장 완료: " + uniqueLink);
                    } catch (Exception e) {
                        System.err.println("❌ 기사 처리 실패 (링크: " + link + "): " + e.getMessage());
                    }
                } else {
                    System.out.println("이미 존재하거나 유효하지 않은 링크: " + link);
                }
            }

            System.out.println("[3단계] 저장된 뉴스 불러오기");
            List<SearchNews> articles = getNewsByKeywordLimit(keyword, 5);
            System.out.println("[3단계 완료] 뉴스 개수: " + articles.size());

            System.out.println("[4단계] 뉴스 요약 시작 (GPT 호출)");
            String summary = summarizeArticles(articles); // Retry logic is applied here
            System.out.println("[4단계 완료] 요약 결과: " + summary);

            System.out.println("[5단계] 요약 저장 시작");
            searchSummaryService.saveOrUpdateSummary(userId, keyword, summary);
            System.out.println("[5단계 완료] 요약 저장 성공");

        } catch (Exception e) {
            System.err.println("🔥 전체 프로세스 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Set<String> searchNewsLinks(String keyword) throws IOException {
        Set<String> result = new HashSet<>();
        String apiUrl = "https://openapi.naver.com/v1/search/news.json?query=" + keyword + "&display=5&start=1&sort=sim";

        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("X-Naver-Client-Id", clientId)
                .addHeader("X-Naver-Client-Secret", clientSecret)
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.body() == null) return result;

            String json = response.body().string();
            JsonNode root = objectMapper.readTree(json);
            for (JsonNode item : root.path("items")) {
                String link = item.path("link").asText();
                if (link.contains("n.news.naver.com")) {
                    result.add(link);
                }
            }
        }
        return result;
    }

    private String extractUniqueLink(String url) {
        if (!url.contains("/article/")) return null;
        String[] parts = url.split("/article/");
        if (parts.length < 2) return null;
        String uniquePart = parts[1].split("\\?")[0];
        return (uniquePart.length() == 14) ? uniquePart : null;
    }

    private void processAndSaveArticle(String uniqueLink, String fullUrl, String keyword, String userId) {
        try {
            Document doc = Jsoup.connect(fullUrl).userAgent("Mozilla/5.0").get();

            String title = doc.select("#title_area span").text();
            String content = doc.select("#dic_area").text();
            if (content.isBlank()) content = "본문 없음";

            String thumbnailUrl = extractImage(doc);

            SearchNews news = SearchNews.builder()
                    .userId(userId)
                    .keyword(keyword)
                    .uniqueLink(uniqueLink)
                    .title(title.isBlank() ? "제목 없음" : title)
                    .content(content)
                    .summary("")
                    .url(fullUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .publishedDate(LocalDateTime.now())
                    .build();

            searchNewsRepository.save(news);
        } catch (Exception e) {
            System.err.println("기사 처리 실패: " + uniqueLink + " - " + e.getMessage());
        }
    }

    private String extractImage(Document doc) {
        String[] selectors = {
                "#img1[src]", "#img1[data-src]",
                "meta[property=og:image]",
                "img._LAZY_LOADING[src]", "img._LAZY_LOADING[data-src]",
                "img[src]"
        };

        for (String selector : selectors) {
            Elements elems = doc.select(selector);
            if (!elems.isEmpty()) {
                String src = elems.attr("content").isEmpty() ? elems.attr("src") : elems.attr("content");
                if (src.startsWith("http")) return src;
            }
        }
        return "이미지 없음";
    }

    public List<SearchNews> getNewsByKeyword(String keyword) {
        return searchNewsRepository.findByKeywordOrderByPublishedDateDesc(keyword);
    }

    public List<SearchNews> getNewsByKeywordLimit(String keyword, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return searchNewsRepository.findByKeywordOrderByPublishedDateDesc(keyword, pageable);
    }

    @SuppressWarnings("BusyWait") // Suppress warning for Thread.sleep()
    public String summarizeArticles(List<SearchNews> articles) {
        if (articles == null || articles.isEmpty()) return "요약할 뉴스가 없습니다.";

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("다음 뉴스 기사들을 읽고, 공통 주제랑 핵심 내용을 중심으로 종합해서 요약해 줘! \n" +
                "비슷하거나 중복되는 내용은 하나로 정리해 주고, 중요한 사건이 왜 일어났고, 어떤 일이 있었는지도 자연스럽게 말해 줘! \n" +
                "말투는 꼭 친구한테 이야기하듯이, 친근하고 귀엽게 해 줘. \n" +
                "'~했다', '~였습니다' 같은 딱딱한 말투는 절대 쓰지 말고, '~했어', '~였어', '~야', '~더라구', '~래' 같은 말투로 말해 줘. \n" +
                "문장은 너무 길지 않게, 말하듯이 끊어 줘. 리듬감 있게, 숨 쉬듯이 자연스럽게 써 줘. \n" +
                "가능하면 감정도 살짝 담아서, 사람 냄새 나는 말투로 써 줘. \n" +
                "예를 들어 이런 느낌이야:\n" +
                "'인천에서 맨홀 사고가 있었어. 안타깝게도 두 명이 다쳤고, 그중 한 명은 목숨을 잃었대...'\n" +
                "'우리 모두가 안전하게 일할 수 있는 환경, 정말 꼭 필요하지!'\n" +
                "이런 식으로 말이야! \n" +
                "내용은 정확하게, 요약은 네가 센스 있게 해 줘!\n\n");


        for (SearchNews article : articles) {
            promptBuilder.append("제목: ").append(article.getTitle()).append("\n");
            promptBuilder.append("내용: ").append(article.getContent()).append("\n\n");
        }

        String prompt = promptBuilder.toString();

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(
                        new ChatMessage("system", "당신은 뉴스 요약 전문가입니다."),
                        new ChatMessage("user", prompt)
                ))
                .maxTokens(500)
                .build();

        int maxRetries = 5; // Maximum number of retries
        long initialDelayMillis = 5000; // Initial delay (5 seconds)

        for (int retryCount = 0; retryCount < maxRetries; retryCount++) {
            try {
                // Call OpenAI API
                return openAiService.createChatCompletion(request)
                        .getChoices()
                        .get(0)
                        .getMessage()
                        .getContent()
                        .trim();
            } catch (OpenAiHttpException e) {
                // Handle HTTP exceptions from OpenAI library
                if (e.statusCode == 429) { // Too Many Requests
                    long delay = initialDelayMillis * (1L << retryCount); // Exponential backoff: 5s, 10s, 20s, 40s, 80s...
                    System.out.println("OpenAI API 429 오류 발생! " + (retryCount + 1) + "차 재시도. " + delay + "ms 대기.");
                    try {
                        // Actual wait
                        TimeUnit.MILLISECONDS.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt(); // Restore interrupt status
                        System.err.println("재시도 대기 중 인터럽트 발생.");
                        throw new RuntimeException("OpenAI API 호출 중단됨", ie); // Throw exception immediately
                    }
                } else {
                    // Throw other HTTP errors immediately
                    System.err.println("OpenAI API 오류 (코드: " + e.statusCode + "): " + e.getMessage());
                    throw e;
                }
            } catch (Exception e) {
                // Handle general exceptions like network issues
                System.err.println("OpenAI API 호출 중 알 수 없는 오류 발생: " + e.getMessage());
                throw new RuntimeException("OpenAI API 호출 실패", e);
            }
        }
        // If max retries exceeded, throw an exception
        throw new RuntimeException("OpenAI API 호출 재시도 횟수 초과. 요약에 실패했습니다.");
    }
}