package com.example.news_summarizer.service;

import com.example.news_summarizer.repository.LoginRepository;
import com.example.news_summarizer.dto.LoginRequest;
import com.example.news_summarizer.entity.SocialProvider;
import com.example.news_summarizer.entity.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class LoginService { 
    private final LoginRepository loginRepository;
    private final WebClient webClient;

    public LoginService(LoginRepository loginRepository, WebClient.Builder webClientBuilder) { // 생성자 이름 변경
        this.loginRepository = loginRepository;
        this.webClient = webClientBuilder.baseUrl("https://kapi.kakao.com")
                                         .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                                         .build();
    }

    // 1. 카카오 액세스 토큰으로 사용자 정보 가져오기
    public Mono<LoginRequest> getLoginRequest(String accessToken) {
        return webClient.get()
                .uri("/v2/user/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(LoginRequest.class)
                .doOnError(e -> System.err.println("카카오 사용자 정보 요청 실패: " + e.getMessage()));
    }

    // 2. 사용자 정보 기반으로 회원가입 또는 로그인 처리
    public User authenticateKakaoUser(LoginRequest loginRequest) {
        Long kakaoId = loginRequest.getId();

        Optional<User> existingUser = loginRepository.findById(kakaoId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            loginRepository.save(user);
            System.out.println("기존 카카오 사용자 로그인/정보 업데이트: " + user.getNickname());
        } else {
            user = User.builder()
                    .id(loginRequest.getId().longValue())
                    .name(loginRequest.getKakaoAccount().getProfile() != null ? loginRequest.getKakaoAccount().getProfile().getNickname() : null)
                    .socialProvider(SocialProvider.KAKAO)
                    .socialId(loginRequest.getKakaoAccount() != null ? loginRequest.getKakaoAccount().getEmail() : null)
                    .build();
            loginRepository.save(user);
            System.out.println("새로운 카카오 사용자 회원가입: ");
        }
        return user;
    }
}