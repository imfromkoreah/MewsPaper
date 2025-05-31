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