<<<<<<< HEAD
// src/main/java/com/example/news_summarizer/controller/UserController.java
package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.NotificationRequest;
import com.example.news_summarizer.dto.UpdateNickName;
import com.example.news_summarizer.entity.User;
import com.example.news_summarizer.entity.NotificationSetting;
import com.example.news_summarizer.service.UserService;
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

    public UserController(UserService userService) {
        this.userService = userService;
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
}
=======
package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.AnchorRequest;
import com.example.news_summarizer.entity.User;
import com.example.news_summarizer.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody AnchorRequest request) {
    Long userId = request.getUserId();
    String nickname = request.getNickname();

    Optional<User> optionalUser = userRepository.findById(userId);

    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        user.setNickname(nickname);
        userRepository.save(user);
        System.out.println("✅ 닉네임 수정 완료: " + user.getNickname());
        return ResponseEntity.ok("닉네임 수정 완료");
    } else {
        System.out.println("❌ 해당 ID의 유저가 없습니다.");
        return ResponseEntity.status(404).body("유저를 찾을 수 없습니다.");
    }
    }
    }
>>>>>>> 22ceb0d4ce7686fe9c7abef8235517902adb0450
