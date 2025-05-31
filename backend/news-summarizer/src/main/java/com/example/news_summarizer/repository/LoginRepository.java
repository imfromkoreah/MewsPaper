package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.SocialProvider;
import com.example.news_summarizer.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<User, Long> {
    Optional<User> findById(Long Id);

    Optional<User> findByEmail(String email);

    Optional<User> findBySocialIdAndSocialProvider(String socialId, SocialProvider socialProvider);
}
