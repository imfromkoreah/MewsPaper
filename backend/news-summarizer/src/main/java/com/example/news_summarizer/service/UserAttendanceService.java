package com.example.news_summarizer.service;

import com.example.news_summarizer.entity.*;
import com.example.news_summarizer.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 트랜잭션 관리를 위해 import

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service // 이 클래스가 스프링 서비스 계층의 컴포넌트임을 나타냅니다.
public class UserAttendanceService {

    private final UserAttendanceRepository userAttendanceRepository;
    private final UserRepository userRepository; // 사용자 정보를 조회하기 위해 필요

    // 의존성 주입: 생성자를 통해 레포지토리를 주입받습니다.
    public UserAttendanceService(UserAttendanceRepository userAttendanceRepository, UserRepository userRepository) {
        this.userAttendanceRepository = userAttendanceRepository;
        this.userRepository = userRepository;
    }

    @Transactional // 이 메소드가 트랜잭션 내에서 실행되도록 합니다. (원자성 보장)
    public UserAttendance recordAttendance(Long userId) {
        // 1. 사용자 존재 여부 확인
        // UserRepository를 사용하여 userId로 User 엔티티를 찾습니다.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ID " + userId + "에 해당하는 사용자를 찾을 수 없습니다."));

        // 2. 오늘 이미 출석했는지 확인
        LocalDate today = LocalDate.now(); // 오늘 날짜를 가져옵니다. (시간 정보 없음)
        Optional<UserAttendance> existingAttendance = userAttendanceRepository.findByUserAndAttendanceDate(user, today);

        if (existingAttendance.isPresent()) {
            // 이미 오늘 날짜로 해당 사용자의 출석 기록이 있다면 예외를 발생시킵니다.
            throw new IllegalStateException("이미 오늘 출석 도장을 찍었습니다.");
        }

        // 3. 새로운 출석 기록 생성 및 저장
        UserAttendance newAttendance = UserAttendance.builder()
                .user(user) // 출석한 사용자
                .attendanceDate(today) // 오늘 날짜\
                .build();

        // AttendanceRepository를 통해 데이터베이스에 출석 기록을 저장합니다.
        return userAttendanceRepository.save(newAttendance);
    }

    // ⭐ 추가: 특정 사용자의 모든 출석 기록을 조회하는 메서드
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션으로 설정하여 성능 최적화
    public List<UserAttendance> getUserAttendances(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ID " + userId + "에 해당하는 사용자를 찾을 수 없습니다."));
        return userAttendanceRepository.findByUser(user); // User 엔티티로 출석 기록 조회
    }
}