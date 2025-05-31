package com.example.news_summarizer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String nickname;

    private String email;
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "social_provider")
    private SocialProvider socialProvider;

    @Column(name = "social_id")
    private String socialId;

    // private String bias;

    // @Column(name = "created_at", updatable = false)
    // private Timestamp createdAt;

    // @Column(name = "updated_at")
    // private Timestamp updatedAt;

    // @PrePersist
    // protected void onCreate() {
    //     this.createdAt = new Timestamp(System.currentTimeMillis());
    // }

    // @PreUpdate
    // protected void onUpdate() {
    //     this.updatedAt = new Timestamp(System.currentTimeMillis());
    // }
}
