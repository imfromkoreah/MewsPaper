package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.SearchNews;
import com.example.news_summarizer.repository.SearchNewsRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SearchNewsService {

    private final SearchNewsRepository searchNewsRepository;
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    public SearchNewsService(SearchNewsRepository searchNewsRepository) {
        this.searchNewsRepository = searchNewsRepository;
    }

    public void searchAndSaveNews(String keyword, String userId) {
        try {
            Set<String> links = searchNewsLinks(keyword);
            for (String link : links) {
                String uniqueLink = extractUniqueLink(link);
                if (uniqueLink != null && !searchNewsRepository.existsByUniqueLink(uniqueLink)) {
                    processAndSaveArticle(uniqueLink, link, keyword, userId);
                }
            }
        } catch (Exception e) {
            System.err.println("뉴스 검색 및 저장 실패: " + e.getMessage());
        }
    }

    private Set<String> searchNewsLinks(String keyword) throws IOException {
        Set<String> result = new HashSet<>();
        String apiUrl = "https://openapi.naver.com/v1/search/news.json?query=" + keyword + "&display=10&start=1&sort=sim";

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
                    .summary("") // 나중에 요약 처리 넣으면 여기에 세팅
                    .url(fullUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .publishedDate(LocalDateTime.now()) // 기사 날짜 크롤링 가능하면 수정
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

    // ★ 추가 메서드 ★
    public List<SearchNews> getNewsByKeyword(String keyword) {
        return searchNewsRepository.findByKeywordOrderByPublishedDateDesc(keyword);
    }
}
