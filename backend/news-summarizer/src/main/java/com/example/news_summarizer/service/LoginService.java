package com.example.news_summarizer.service;

import com.example.news_summarizer.repository.LoginRepository;
import com.example.news_summarizer.dto.LoginRequest; // 카카오 사용자 정보 DTO
import com.example.news_summarizer.entity.SocialProvider;
import com.example.news_summarizer.entity.User;
import com.fasterxml.jackson.databind.JsonNode; // 네이버 API 응답 파싱용
import org.springframework.beans.factory.annotation.Value; // 환경 변수 주입
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime; // 사용자 생성/업데이트 시간 기록용
import java.util.Optional;

@Service
public class LoginService {
    private final LoginRepository loginRepository;
    private final WebClient webClient;

    // 카카오 관련 환경 변수 (WebClient에 baseUrl로 설정했으므로, 여기서는 불필요)
    // @Value("${kakao.user-info-uri}")
    // private String kakaoUserInfoUri;

    // 네이버 관련 환경 변수 추가
    @Value("${naver.client-id}")
    private String naverClientId;
    @Value("${naver.client-secret}")
    private String naverClientSecret;
    @Value("${naver.callback-uri}") // 프론트엔드와 동일한 콜백 URI (인증 코드 교환 시 필요)
    private String naverCallbackUri;
    @Value("${naver.token-uri}")
    private String naverTokenUri;
    @Value("${naver.profile-uri}")
    private String naverProfileUri;

    public LoginService(LoginRepository loginRepository, WebClient.Builder webClientBuilder) {
        this.loginRepository = loginRepository;
        // WebClient.Builder를 사용하여 기본 설정을 구성 (카카오 전용 WebClient)
        // 네이버는 별도로 URI를 구성할 것이므로, 이 WebClient는 카카오 전용으로 사용합니다.
        this.webClient = webClientBuilder
                .baseUrl("https://kapi.kakao.com") // 카카오 기본 URL
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();
    }

    // --- 카카오 로그인 관련 메서드 ---

    // 1. 카카오 액세스 토큰으로 사용자 정보 가져오기
    public Mono<LoginRequest> getKakaoUserInfo(String accessToken) { // 메서드명 변경 (좀 더 명확하게)
        return webClient.get()
                .uri("/v2/user/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(LoginRequest.class)
                .doOnError(e -> System.err.println("카카오 사용자 정보 요청 실패: " + e.getMessage()));
    }

    // 2. 카카오 사용자 정보 기반으로 회원가입 또는 로그인 처리
    public User authenticateKakaoUser(LoginRequest loginRequest) {
        // 카카오에서 받은 고유 ID (String으로 변환하여 socialId 필드에 저장)
        String name = loginRequest.getKakaoAccount() != null && loginRequest.getKakaoAccount().getProfile() != null ?
                          loginRequest.getKakaoAccount().getProfile().getNickname() : null;
        String email = loginRequest.getKakaoAccount() != null ? loginRequest.getKakaoAccount().getEmail() : null;
        
        Optional<User> existingUser = loginRepository.findBySocialIdAndSocialProvider(email, SocialProvider.KAKAO);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setName(name);
            user.setUpdatedAt(LocalDateTime.now());
            loginRepository.save(user);
            System.out.println("기존 카카오 사용자 로그인인: " + user.getNickname());
        } else {
            user = User.builder()
                    .socialId(email) // 카카오 고유 ID를 socialId에 저장
                    .socialProvider(SocialProvider.KAKAO)
                    .name(name)
                    .email(email)
                    .createdAt(LocalDateTime.now()) // 생성 시간 기록
                    .updatedAt(LocalDateTime.now()) // 업데이트 시간 기록
                    .build();
            loginRepository.save(user);
            System.out.println("새로운 카카오 사용자 회원가입: " + user.getNickname());
        }
        return user;
    }

    public Mono<JsonNode> getNaverAccessToken(String code, String state) {
        // 네이버 토큰 요청을 위한 WebClient는 별도로 설정 (baseUrl이 다름)
        return WebClient.builder().baseUrl(naverTokenUri).build().get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("grant_type", "authorization_code")
                        .queryParam("client_id", naverClientId)
                        .queryParam("client_secret", naverClientSecret)
                        .queryParam("code", code)
                        .queryParam("state", state)
                        .queryParam("redirect_uri", naverCallbackUri)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .doOnError(e -> System.err.println("네이버 토큰 요청 오류: " + e.getMessage()));
    }

    /**
     * 네이버 Access Token을 사용하여 사용자 프로필 정보를 요청합니다.
     * @param accessToken 네이버 Access Token
     * @return 네이버 사용자 프로필 응답 (JSON Node)
     */
    public Mono<JsonNode> getNaverUserProfile(String accessToken) {
        // 네이버 프로필 요청을 위한 WebClient는 별도로 설정
        return WebClient.builder().baseUrl(naverProfileUri).build().get()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .doOnError(e -> System.err.println("네이버 프로필 요청 오류: " + e.getMessage()));
    }

    /**
     * 네이버 사용자 정보를 기반으로 로그인 또는 회원가입을 처리합니다.
     * @param naverUserProfile 네이버 API에서 받은 사용자 프로필 정보 (JsonNode)
     * @return 인증된 User 엔티티
     */
    public User authenticateNaverUser(JsonNode naverUserProfile) {
        JsonNode responseNode = naverUserProfile.get("response"); // "response" 필드 안에 실제 사용자 정보가 있음

        if (responseNode == null) {
            throw new IllegalArgumentException("네이버 사용자 프로필 응답에 'response' 필드가 없습니다.");
        }

        String nickname = responseNode.get("nickname") != null ? responseNode.get("nickname").asText() : null;
        String email = responseNode.get("email") != null ? responseNode.get("email").asText() : null;
        String name = responseNode.get("name") != null ? responseNode.get("name").asText() : null; // 네이버는 name 필드도 제공

        // socialId와 socialProvider로 사용자를 찾습니다.
        Optional<User> existingUser = loginRepository.findBySocialIdAndSocialProvider(email, SocialProvider.NAVER);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // 기존 사용자: 정보 업데이트 (필요하다면)
            user.setName(name);
            user.setUpdatedAt(LocalDateTime.now()); // 업데이트 시간 기록
            loginRepository.save(user);
            System.out.println("기존 네이버 사용자 로그인/정보 업데이트: " + user.getNickname());
        } else {
            // 신규 사용자: DB에 저장
            user = User.builder()
                    .socialId(email)
                    .socialProvider(SocialProvider.NAVER)
                    .email(email)
                    .name(name)
                    .createdAt(LocalDateTime.now()) // 생성 시간 기록
                    .updatedAt(LocalDateTime.now()) // 업데이트 시간 기록
                    .build();
            loginRepository.save(user);
            System.out.println("새로운 네이버 사용자 회원가입: " + user.getNickname());
        }
        return user;
    }
}