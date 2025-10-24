// src/main/java/com/example/news_summarizer/entity/NotificationSetting.java
package com.example.news_summarizer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.sql.Time;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_settings") // 테이블 이름 확인
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // DB의 id 컬럼과 매핑

    @Column(name = "user_id", nullable = false)
    private Long userId; // DB의 user_id 컬럼과 매핑 (int -> Integer)

    @Column(name = "notification_type", nullable = false, length = 100)
    private String notificationType; // DB의 notification_type 컬럼과 매핑

    @Column(name = "notification_time", nullable = false)
    private Time notificationTime; // DB의 notification_time 컬럼과 매핑

    @Column(name = "is_active", nullable = false) // DB의 is_active 컬럼과 매핑 (TINYINT(1) -> Boolean)
    private Boolean isActive = true; // 기본값 TRUE (DB DEFAULT 1에 해당)
    
    @Column(name = "fcm_token")
    private String fcmToken; // 필드 이름이 userFcmToken 입니다.

    // @Column(name = "created_at", nullable = false, updatable = false) // DB의 created_at 컬럼과 매핑
    // private LocalDateTime createdAt;

    // @Column(name = "updated_at", nullable = false) // DB의 updated_at 컬럼과 매핑
    // private LocalDateTime updatedAt;

    // @PrePersist
    // protected void onCreate() {
    //     this.createdAt = LocalDateTime.now();
    //     this.updatedAt = LocalDateTime.now();
    // }

    // @PreUpdate
    // protected void onUpdate() {
    //     this.updatedAt = LocalDateTime.now();
    // }
}