package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.NotificationRequest;
import com.example.news_summarizer.dto.UpdateNickName;
import com.example.news_summarizer.entity.User;
import com.example.news_summarizer.entity.NotificationSetting;
import com.example.news_summarizer.service.UserService;
import com.example.news_summarizer.dto.UserPreferenceRequest; // 추가: UserPreferenceRequest DTO 임포트
import com.example.news_summarizer.entity.UserPreference;     // 추가: UserPreference Entity 임포트
import com.example.news_summarizer.service.UserPreferenceService; // 추가: UserPreferenceService 임포트

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user") // 사용자 관련 API는 /api/user 아래에 두는 것이 일반적
public class UserController {

    private final UserService userService;
    private final UserPreferenceService userPreferenceService; // 추가: UserPreferenceService 주입

    // 생성자 주입 방식으로 서비스 주입
    public UserController(UserService userService, UserPreferenceService userPreferenceService) {
        this.userService = userService;
        this.userPreferenceService = userPreferenceService; // 추가: UserPreferenceService 초기화
    }

    @PostMapping("/update-nickname") // 닉네임 업데이트 엔드포인트
    public ResponseEntity<Map<String, Object>> updateNickname(@RequestBody UpdateNickName request) {
        Long id = request.getId();
        String newNickname = request.getNickname();

        Map<String, Object> response = new HashMap<>();

        if (id == null) {
            response.put("success", false);
            response.put("message", "id가 필요합니다.");
            return ResponseEntity.badRequest().body(response);
        }
        if (newNickname == null || newNickname.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "닉네임을 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            User updatedUser = userService.updateNickname(id, newNickname);
            response.put("success", true);
            response.put("message", "닉네임이 성공적으로 업데이트되었습니다.");
            response.put("user", updatedUser); // 업데이트된 사용자 정보 반환 (선택 사항)
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("닉네임 업데이트 중 오류: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/save-notifications")
    public ResponseEntity<Map<String, Object>> saveUserNotifications(@RequestBody Map<String, Object> requestBody) {
        String sid = (String) requestBody.get("userId");
        Long id = Long.parseLong(sid);
        @SuppressWarnings("unchecked")
        List<Map<String, String>> notificationsData = (List<Map<String, String>>) requestBody.get("notifications");

        Map<String, Object> response = new HashMap<>();

        if (id == null || notificationsData == null) {
            response.put("success", false);
            response.put("message", "로그인 정보를 확인해주세요.");
            return ResponseEntity.badRequest().body(response);
        }

        // Map 리스트를 NotificationRequest 리스트로 변환
        List<NotificationRequest> notificationRequests = notificationsData.stream().map(data ->
            new NotificationRequest(data.get("notificationType"), data.get("notificationTime"))
        ).collect(Collectors.toList());

        try {
            List<NotificationSetting> savedNotifications = userService.saveUserNotifications(id, notificationRequests);
            response.put("success", true);
            response.put("message", "알림 설정이 성공적으로 저장되었습니다.");
            response.put("savedNotifications", savedNotifications);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("알림 설정 저장 중 오류: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/save-preferences")
    public ResponseEntity<Map<String, Object>> saveUserPreferences(@RequestBody UserPreferenceRequest request) {
        Map<String, Object> response = new HashMap<>();

        Long userId;
        try {
            userId = Long.parseLong(request.getUserId());
        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "유효하지 않은 사용자 ID 형식입니다.");
            return ResponseEntity.badRequest().body(response);
        }

        List<String> preferenceKeys = request.getPreferences();

        if (userId == null || preferenceKeys == null) {
            response.put("success", false);
            response.put("message", "사용자 정보 또는 관심사 데이터가 누락되었습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            List<UserPreference> savedPreferences = userPreferenceService.saveUserPreferences(userId, preferenceKeys);
            response.put("success", true);
            response.put("message", "관심사 설정이 성공적으로 저장되었습니다.");
            response.put("savedPreferences", savedPreferences);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 예시: 비즈니스 로직 오류
        } catch (Exception e) {
            System.err.println("관심사 설정 저장 중 오류: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}