package com.example.news_summarizer.repository;

import com.example.news_summarizer.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository // 이 인터페이스가 스프링 데이터 JPA 레포지토리임을 나타냅니다.
public interface UserAttendanceRepository extends JpaRepository<UserAttendance, Long> {
    // 특정 User가 특정 날짜에 이미 출석했는지 확인하는 쿼리 메서드
    // Spring Data JPA는 메서드 이름을 분석하여 자동으로 SQL 쿼리를 생성합니다.
    Optional<UserAttendance> findByUserAndAttendanceDate(User user, LocalDate attendanceDate);

    List<UserAttendance> findByUser(User user);
}