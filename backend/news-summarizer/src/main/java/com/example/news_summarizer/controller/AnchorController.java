package com.example.news_summarizer.controller;

import com.example.news_summarizer.dto.AnchorRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 프론트에서 요청을 받는 컨트롤러
@RestController
@RequestMapping("/api/anchors")
@CrossOrigin(origins = "http://localhost:5173") // 프론트 주소 허용 (CORS)
public class AnchorController {

    @PostMapping
    public ResponseEntity<String> createAnchor(@RequestBody AnchorRequest request) {
        System.out.println("받은 닉네임: " + request.getNickname());

        // DB 저장은 나중에 하고, 지금은 잘 받는지만 확인
        return ResponseEntity.ok("저장 성공!");
    }
}