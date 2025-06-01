package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.News;
import com.example.news_summarizer.repository.NewsRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class CrawlerService {

    private final NewsRepository newsRepository;

    public CrawlerService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public void crawl(int categoryId) {
        try {
            String baseUrl = "https://news.naver.com/section/" + categoryId;
            Document doc = Jsoup.connect(baseUrl).userAgent("Mozilla/5.0").get();

            Set<String> uniqueLinks = new LinkedHashSet<>();
            Elements links = doc.select("a[href*=/article/]");

            for (Element link : links) {
                String href = link.attr("href");
                String[] parts = href.split("/article/");
                if (parts.length > 1) {
                    String uniqueLink = parts[1].split("\\?")[0];
                    if (uniqueLink.length() == 14) {
                        uniqueLinks.add(uniqueLink);
                        if (uniqueLinks.size() >= 10) break;
                    }
                }
            }

            for (String uniqueLink : uniqueLinks) {
                processArticle(uniqueLink, categoryId);
            }

        } catch (IOException e) {
            System.err.println("크롤링 오류: " + e.getMessage());
        }
    }

    private void processArticle(String uniqueLink, int categoryId) {
        try {
            String url = "https://n.news.naver.com/article/" + uniqueLink;

            // PK 기준 중복 확인
            if (newsRepository.existsById(uniqueLink)) return;

            Document doc = Jsoup.connect(url).userAgent("Mozilla/5.0").get();

            String title = doc.select("#title_area span").text();
            String content = doc.select("#dic_area").text();
            if (content.isBlank()) {
                content = "본문 없음";
            }

            String thumbnailUrl = extractImage(doc);

            News news = News.builder()
                    .uniqueLink(uniqueLink) // PK 설정
                    .title(title.isBlank() ? "제목 없음" : title)
                    .content(content)
                    .categoryId(categoryId)
                    .url(url)
                    .thumbnailUrl(thumbnailUrl)
                    .build();

            newsRepository.save(news);

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
}
