// src/main/java/com/yourcompany/yourapp/model/UserPreference.java
package com.example.news_summarizer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "preference_key", nullable = false)
    private String preferenceKey; // 예: "POLITICS", "ECONOMY", "IT_SCIENCE"

    public UserPreference(Long userId, String preferenceKey) {
        this.userId = userId;
        this.preferenceKey = preferenceKey;
    }

    // @CreationTimestamp
    // @Column(name = "created_at", nullable = false, updatable = false)
    // private LocalDateTime createdAt;

    // @UpdateTimestamp
    // @Column(name = "updated_at", nullable = false)
    // private LocalDateTime updatedAt;

    // // 생성자 (id, createdAt, updatedAt 제외)
    // public UserPreference(Long userId, String preferenceKey, String preferenceValue) {
    //     this.userId = userId;
    //     this.preferenceKey = preferenceKey;
    //     this.preferenceValue = preferenceValue;
    // }
}