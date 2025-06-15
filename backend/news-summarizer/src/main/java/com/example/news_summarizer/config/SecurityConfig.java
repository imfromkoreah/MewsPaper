// SecurityConfig.java (추가)
package com.example.news_summarizer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }

    @Bean // 이 메서드가 반환하는 객체를 스프링 빈으로 등록하라는 의미입니다.
    public PasswordEncoder passwordEncoder() {
        // BCryptPasswordEncoder는 가장 널리 사용되고 안전하다고 알려진 비밀번호 해싱 함수 중 하나입니다.
        return new BCryptPasswordEncoder();
    }

}
