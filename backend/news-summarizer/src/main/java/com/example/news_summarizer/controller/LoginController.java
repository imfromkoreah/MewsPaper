package com.example.news_summarizer.controller;

// 필요한 모든 임포트 문 (기존 임포트 유지)
import com.example.news_summarizer.service.LoginService;
import com.fasterxml.jackson.databind.JsonNode;
import com.example.news_summarizer.dto.*; // 카카오 API 응답 DTO
import com.example.news_summarizer.entity.User;
import com.example.news_summarizer.security.JwtTokenProvider;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginController(LoginService loginService, JwtTokenProvider jwtTokenProvider) {
    this.loginService = loginService;
    this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/kakao")
    public ResponseEntity<LoginResponse> kakaoLogin(@RequestBody AccessTokenRequest requestBody) {
        String kakaoAccessToken = requestBody.getAccessToken();

        if (kakaoAccessToken == null || kakaoAccessToken.isEmpty()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "카카오 액세스 토큰이 필요합니다.", null, null, null)); // redirectUrl null 추가
        }

        try {
            // loginService.getLoginRequest가 Mono<LoginRequest>를 반환하는 경우, .block()을 사용합니다.
            // 블록킹 방식은 동기 처리에 사용되며, 비동기 처리를 더 선호한다면 Mono를 직접 반환하도록 Controller를 수정해야 합니다.
            LoginRequest kakaoUserInfoFromApi = loginService.getKakaoUserInfo(kakaoAccessToken).block();

            if (kakaoUserInfoFromApi == null || kakaoUserInfoFromApi.getId() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "카카오 사용자 정보를 가져올 수 없습니다.", null, null, null)); // redirectUrl null 추가
            }

            User user = loginService.authenticateKakaoUser(kakaoUserInfoFromApi);

            // 닉네임 존재 여부 확인 및 redirectUrl 결정
            String redirectUrl;
            // user.getNickname()이 null이거나 비어있지 않은지 (공백만 있는 경우도 포함) 확인
            boolean hasNickname = user.getNickname() != null && !user.getNickname().trim().isEmpty();

            if (hasNickname) {
                redirectUrl = "http://localhost:5173/home";
            } else {
                redirectUrl = "http://localhost:5173/onboarding";
            }

            // UserData 객체 생성 시 LoginResponse.UserData 클래스의 필드 순서와 일치하도록 값 전달
            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getId(),
                user.getName(), // name (User 엔티티에 name 필드가 있다면)
                user.getNickname(), // nickname
                user.getEmail(),    // email (LoginResponse.UserData에 email 필드가 있다면)
                user.getSocialProvider() != null ? user.getSocialProvider().name() : "", // socialProvider (enum을 String으로 변환)
                user.getSocialId() // socialId
            );
            String token = jwtTokenProvider.generateToken(user.getId());
            // 최종 LoginResponse 반환 시 redirectUrl 포함
            return ResponseEntity.ok(new LoginResponse(
                true,
                "로그인 성공",
                userData,
                redirectUrl, // 결정된 redirectUrl 포함
                token
            ));

        } catch (Exception e) {
            System.err.println("카카오 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스 출력하여 디버깅 용이하게 함
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null, null)); // redirectUrl null 추가
        }
    }

    // --- 네이버 로그인 엔드포인트 ---
    @PostMapping("/naver")
    public ResponseEntity<LoginResponse> naverLogin(@RequestBody NaverLoginRequest requestBody) {
        String code = requestBody.getCode();
        String state = requestBody.getState();

        // 수정된 부분: code == null 오타 수정 및 메시지 조정
        if (code == null || state == null || state.isEmpty()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "네이버 인증 코드 또는 상태값이 필요합니다.", null, null, null));
        }

        try {
            // 1. 네이버로부터 Access Token 받기
            JsonNode tokenResponse = loginService.getNaverAccessToken(code, state).block();

            if (tokenResponse == null || tokenResponse.has("error")) {
                String errorMsg = tokenResponse != null ? tokenResponse.get("error_description").asText() : "알 수 없는 오류";
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "네이버 토큰 획득 실패: " + errorMsg, null, null, null));
            }

            String naverAccessToken = tokenResponse.get("access_token").asText();

            // 2. 네이버 Access Token으로 사용자 프로필 정보 요청
            JsonNode naverUserProfile = loginService.getNaverUserProfile(naverAccessToken).block();

            if (naverUserProfile == null || (naverUserProfile.has("resultcode") && naverUserProfile.get("resultcode").asText().equals("024"))) {
                    String errorMsg = naverUserProfile != null ? naverUserProfile.get("message").asText() : "사용자 정보 접근 실패";
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "네이버 사용자 정보 획득 실패: " + errorMsg, null, null, null));
            }
            if (naverUserProfile == null || !naverUserProfile.has("response")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "네이버 사용자 정보를 가져올 수 없습니다.", null, null, null));
            }

            // 3. 사용자 정보로 로그인/회원가입 처리
            User user = loginService.authenticateNaverUser(naverUserProfile);

            String redirectUrl;
            boolean hasNickname = user.getNickname() != null && !user.getNickname().trim().isEmpty();

            if (hasNickname) {
                redirectUrl = "http://localhost:5173/home";
            } else {
                redirectUrl = "http://localhost:5173/onboarding";
            }

            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getId(),
                user.getName(),
                user.getNickname(),
                user.getEmail(),
                user.getSocialProvider() != null ? user.getSocialProvider().name() : null,
                user.getSocialId()
            );
            String token = jwtTokenProvider.generateToken(user.getId());
            return ResponseEntity.ok(new LoginResponse(
                true,
                "로그인 성공",
                userData,
                redirectUrl,
                token
            ));

        } catch (Exception e) {
            System.err.println("네이버 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null, null));
        }
    }

    // --- 구글 로그인 엔드포인트 ---
    @PostMapping("/google")
    public ResponseEntity<LoginResponse> googleLogin(@RequestBody GoogleLoginRequest requestBody) {
        String code = requestBody.getCode();
        String state = requestBody.getState();

        if (code == null || state == null || state.isEmpty()) { // 첫 번째 code == null은 오타인듯
            return ResponseEntity.badRequest().body(new LoginResponse(false, "구글 인증 코드 또는 상태값이 필요합니다.", null, null, null)); // 여기도 LoginResponse 인자 개수 통일
        }

        try {
            // 1. Google Access Token 받기
            // !!! 여기를 loginService.getGoogleAccessToken(code) 로 변경 !!!
            JsonNode tokenResponse = loginService.getGoogleAccessToken(code).block(); // state는 Google 토큰 요청에 직접적으로 쓰이지 않을 수 있음

            if (tokenResponse == null || tokenResponse.has("error")) {
                String errorMsg = tokenResponse != null ? tokenResponse.get("error_description").asText() : "알 수 없는 오류";
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "Google 토큰 획득 실패: " + errorMsg, null, null, null)); // 여기도 LoginResponse 인자 개수 통일
            }

            String googleAccessToken = tokenResponse.get("access_token").asText();

            // 2. Google Access Token으로 사용자 프로필 정보 요청
            // !!! 여기를 loginService.getGoogleUserProfile(googleAccessToken).block() 로 변경 !!!
            JsonNode googleUserProfile = loginService.getGoogleUserProfile(googleAccessToken).block();

            // Google 사용자 정보 응답 구조에 따라 에러 처리 로직 수정 필요
            // Google userinfo API는 보통 "error" 필드가 직접적으로 없을 수 있음
            if (googleUserProfile == null || googleUserProfile.has("error")) { // 예시
                String errorMsg = googleUserProfile != null ? googleUserProfile.get("error_description").asText() : "알 수 없는 오류";
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "Google 사용자 정보 획득 실패: " + errorMsg, null, null, null)); // 여기도 LoginResponse 인자 개수 통일
            }


            // 3. 사용자 정보로 로그인/회원가입 처리
            // !!! 여기를 loginService.authenticateGoogleUser(googleUserProfile) 로 변경 !!!
            User user = loginService.authenticateGoogleUser(googleUserProfile);

            // ... (리다이렉션 URL 및 응답 데이터는 네이버와 동일하게 사용 가능)
            String redirectUrl;
            boolean hasNickname = user.getNickname() != null && !user.getNickname().trim().isEmpty();

            if (hasNickname) {
                redirectUrl = "http://localhost:5173/home";
            } else {
                redirectUrl = "http://localhost:5173/onboarding";
            }

            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getId(),
                user.getName(),
                user.getNickname(),
                user.getEmail(),
                user.getSocialProvider() != null ? user.getSocialProvider().name() : null,
                user.getSocialId()
            );
            String token = jwtTokenProvider.generateToken(user.getId()); // 토큰 생성 추가

            return ResponseEntity.ok(new LoginResponse(
                true,
                "로그인 성공",
                userData,
                redirectUrl,
                token // 토큰 추가
            ));

        } catch (WebClientResponseException e) { // WebClientResponseException 추가 처리
            System.err.println("Google 로그인 중 WebClient 오류 발생: " + e.getMessage() + " - 응답 본문: " + e.getResponseBodyAsString()); // System.err.println 사용
            e.printStackTrace(); // 스택 트레이스 출력
            // Google에서 반환한 HTTP 상태 코드와 본문을 그대로 전달
            return ResponseEntity.status(e.getStatusCode()).body(new LoginResponse(false, "Google 로그인 오류: " + e.getResponseBodyAsString(), null, null, null)); // 여기도 LoginResponse 인자 개수 통일
        } catch (Exception e) {
            System.err.println("Google 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null, null)); // 여기도 LoginResponse 인자 개수 통일
        }
    }

    // --- 직접 로그인 엔드포인트 ---
    @PostMapping("/email")
    public ResponseEntity<LoginResponse> emailRegister(@RequestBody EmailLoginRequest requestBody) {
       
        if (requestBody == null) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "이메일/비밀번호는 필수입니다.", null, null, null));
        }

        try {
            User user = loginService.authenticateEmailUser(requestBody, "reg");

            String redirectUrl;
            boolean hasNickname = user.getNickname() != null && !user.getNickname().trim().isEmpty();

            if (hasNickname) {
                redirectUrl = "http://localhost:5173/home";
            } else {
                redirectUrl = "http://localhost:5173/onboarding";
            }

            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getId(),
                user.getName(),
                user.getNickname(),
                user.getEmail(),
                user.getSocialProvider() != null ? user.getSocialProvider().name() : null,
                user.getSocialId()
            );

            return ResponseEntity.ok(new LoginResponse(
                true,
                "로그인 성공",
                userData,
                redirectUrl, ""
            ));

        } catch (Exception e) {
            System.err.println("이메일 로그인 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null, null));
        }
    }
    // --- 직접 로그인 엔드포인트 ---
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> emailLogin(@RequestBody EmailLoginRequest requestBody) {
       
        if (requestBody == null) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "이메일/비밀번호는 필수입니다.", null, null, null));
        }

        try {
            User user = loginService.authenticateEmailUser(requestBody, "login");

            String redirectUrl;
            boolean hasNickname = user.getNickname() != null && !user.getNickname().trim().isEmpty();

            if (hasNickname) {
                redirectUrl = "http://localhost:5173/home";
            } else {
                redirectUrl = "http://localhost:5173/onboarding";
            }

            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getId(),
                user.getName(),
                user.getNickname(),
                user.getEmail(),
                user.getSocialProvider() != null ? user.getSocialProvider().name() : null,
                user.getSocialId()
            );

            return ResponseEntity.ok(new LoginResponse(
                true,
                "로그인 성공",
                userData,
                redirectUrl, redirectUrl
            ));

        } catch (Exception e) {
            System.err.println("이메일 로그인 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null, null));
        }
    }
    

}