package com.example.news_summarizer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate; // 날짜만 저장하기 위해 LocalDate 사용
import java.time.LocalDateTime; // 생성 시간을 위해 LocalDateTime 사용

@Entity // 이 클래스가 JPA 엔티티임을 나타냅니다.
@Getter // Lombok: 모든 필드에 대한 Getter 메소드 자동 생성
@Setter // Lombok: 모든 필드에 대한 Setter 메소드 자동 생성
@NoArgsConstructor // Lombok: 기본 생성자 자동 생성
@AllArgsConstructor // Lombok: 모든 필드를 인자로 받는 생성자 자동 생성
@Builder // Lombok: 빌더 패턴을 사용하여 객체를 생성할 수 있게 해줍니다.
@Table(name = "attendance_activity") // 데이터베이스 테이블 이름을 "attendance"로 지정합니다.
public class UserAttendance {

    @Id // 기본 키(Primary Key)임을 나타냅s니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 생성 전략: 데이터베이스에 위임 (Auto Increment)
    private Long id; // 출석 기록의 고유 ID

    @ManyToOne(fetch = FetchType.LAZY) // 다대일 관계: 여러 출석 기록이 하나의 User에 속함 (지연 로딩)
    @JoinColumn(name = "user_id", nullable = false) // 외래 키(Foreign Key) 설정: 'attendance' 테이블의 'user_id' 컬럼이 'user' 테이블의 기본 키를 참조합니다.
    private User user; // 출석한 사용자 엔티티

    @Column(name = "check_date", nullable = false) // Explicitly map to 'check_date' DB column
    private LocalDate attendanceDate; // 출석이 기록된 날짜 (시간 정보 없음)

    @Column(nullable = false) // null 값을 허용하지 않습니다.
    private LocalDateTime createdAt; // 출석 기록이 생성된 정확한 시간

    // 엔티티가 영속화(저장)되기 전에 createdAt 필드를 현재 시간으로 자동 설정합니다.
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}