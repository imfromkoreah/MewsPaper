package com.example.news_summarizer.controller;

// 필요한 모든 임포트 문 (기존 임포트 유지)
import com.example.news_summarizer.service.LoginService;
import com.fasterxml.jackson.databind.JsonNode;
import com.example.news_summarizer.dto.AccessTokenRequest;
import com.example.news_summarizer.dto.LoginRequest; // 카카오 API 응답 DTO
import com.example.news_summarizer.dto.LoginResponse;
import com.example.news_summarizer.dto.LoginResponse.UserData;
import com.example.news_summarizer.dto.NaverLoginRequest;
import com.example.news_summarizer.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/kakao")
    public ResponseEntity<LoginResponse> kakaoLogin(@RequestBody AccessTokenRequest requestBody) {
        String kakaoAccessToken = requestBody.getAccessToken();

        if (kakaoAccessToken == null || kakaoAccessToken.isEmpty()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "카카오 액세스 토큰이 필요합니다.", null, null)); // redirectUrl null 추가
        }

        try {
            // loginService.getLoginRequest가 Mono<LoginRequest>를 반환하는 경우, .block()을 사용합니다.
            // 블록킹 방식은 동기 처리에 사용되며, 비동기 처리를 더 선호한다면 Mono를 직접 반환하도록 Controller를 수정해야 합니다.
            LoginRequest kakaoUserInfoFromApi = loginService.getKakaoUserInfo(kakaoAccessToken).block();

            if (kakaoUserInfoFromApi == null || kakaoUserInfoFromApi.getId() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "카카오 사용자 정보를 가져올 수 없습니다.", null, null)); // redirectUrl null 추가
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

            // 최종 LoginResponse 반환 시 redirectUrl 포함
            return ResponseEntity.ok(new LoginResponse(
                true,
                "로그인 성공",
                userData,
                redirectUrl // 결정된 redirectUrl 포함
            ));

        } catch (Exception e) {
            System.err.println("카카오 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스 출력하여 디버깅 용이하게 함
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null)); // redirectUrl null 추가
        }
    }

    // --- 네이버 로그인 엔드포인트 ---
    @PostMapping("/naver")
    public ResponseEntity<LoginResponse> naverLogin(@RequestBody NaverLoginRequest requestBody) {
        String code = requestBody.getCode();
        String state = requestBody.getState();

        if (code == null || code == null || state == null || state.isEmpty()) { // 첫 번째 code == null은 오타인듯
            return ResponseEntity.badRequest().body(new LoginResponse(false, "네이버 인증 코드 또는 상태값이 필요합니다.", null, null));
        }

        try {
            // 1. 네이버로부터 Access Token 받기
            JsonNode tokenResponse = loginService.getNaverAccessToken(code, state).block();

            if (tokenResponse == null || tokenResponse.has("error")) {
                String errorMsg = tokenResponse != null ? tokenResponse.get("error_description").asText() : "알 수 없는 오류";
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "네이버 토큰 획득 실패: " + errorMsg, null, null));
            }

            String naverAccessToken = tokenResponse.get("access_token").asText();

            // 2. 네이버 Access Token으로 사용자 프로필 정보 요청
            JsonNode naverUserProfile = loginService.getNaverUserProfile(naverAccessToken).block();

            if (naverUserProfile == null || (naverUserProfile.has("resultcode") && naverUserProfile.get("resultcode").asText().equals("024"))) {
                 String errorMsg = naverUserProfile != null ? naverUserProfile.get("message").asText() : "사용자 정보 접근 실패";
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "네이버 사용자 정보 획득 실패: " + errorMsg, null, null));
            }
            if (naverUserProfile == null || !naverUserProfile.has("response")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "네이버 사용자 정보를 가져올 수 없습니다.", null, null));
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

            UserData userData = new UserData(
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
                redirectUrl
            ));

        } catch (Exception e) {
            System.err.println("네이버 로그인 백엔드 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new LoginResponse(false, "서버 오류: " + e.getMessage(), null, null));
        }
    }

}