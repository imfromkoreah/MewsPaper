package com.example.news_summarizer.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging; // 🚨 필수 import 추가

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // 🚨 필수 어노테이션 추가
import org.springframework.util.ResourceUtils; // 🚨 파일 로딩을 위한 util import

import java.io.FileInputStream;
import java.io.IOException;

@Configuration // ✅ 이 클래스를 스프링 설정 파일로 인식시킵니다.
public class FirebaseConfig {

    // ✅ application.properties에서 경로를 주입받습니다. (보안상 권장)
    @Value("${firebase.sdk.path}")
    private String sdkPath;
    
    // 1. FirebaseApp 빈 정의
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // Classpath를 사용하여 JSON 파일을 안전하게 로드합니다.
        FileInputStream serviceAccount = new FileInputStream(ResourceUtils.getFile(sdkPath));

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        // 이미 초기화된 경우를 처리합니다.
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp app = FirebaseApp.initializeApp(options);
            System.out.println("✅ Firebase initialized!");
            return app;
        } else {
            // 이미 초기화된 경우, 기존 인스턴스를 사용합니다.
            return FirebaseApp.getInstance();
        }
    }

    // 2. FirebaseMessaging 빈 정의 (NotificationService가 필요로 하는 빈)
    @Bean
    public FirebaseMessaging firebaseMessaging(FirebaseApp firebaseApp) {
        // 위에서 생성된 FirebaseApp 빈을 사용하여 FirebaseMessaging 인스턴스를 얻습니다.
        return FirebaseMessaging.getInstance(firebaseApp);
    }
}