package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.SearchSummary;
import com.example.news_summarizer.repository.SearchSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchSummaryService {

    private final SearchSummaryRepository searchSummaryRepository;

    // 저장 또는 업데이트
    public SearchSummary saveOrUpdateSummary(String userId, String keyword, String summary) {
        Optional<SearchSummary> existing = searchSummaryRepository.findByUserIdAndKeyword(userId, keyword);

        if (existing.isPresent()) {
            SearchSummary summaryEntity = existing.get();
            summaryEntity.setSummary(summary);
            return searchSummaryRepository.save(summaryEntity);
        } else {
            SearchSummary newSummary = SearchSummary.builder()
                    .userId(userId)
                    .keyword(keyword)
                    .summary(summary)
                    .build();
            return searchSummaryRepository.save(newSummary);
        }
    }

    // 조회
    public Optional<SearchSummary> getSummaryByUserIdAndKeyword(String userId, String keyword) {
        return searchSummaryRepository.findByUserIdAndKeyword(userId, keyword);
    }
}
