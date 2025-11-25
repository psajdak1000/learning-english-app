package com.example.englishapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Wyłączamy CSRF (standard przy REST API)
                .csrf(AbstractHttpConfigurer::disable)
                // 2. Włączamy obsługę CORS (żeby React mógł gadać z Javą)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 3. Konfigurujemy, które adresy są otwarte
                .authorizeHttpRequests(auth -> auth
                        // Pozwól każdemu wejść na logowanie i rejestrację
                        .requestMatchers("/api/auth/**").permitAll()
                        // Wszystko inne wymaga bycia zalogowanym
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // Konfiguracja CORS - pozwala Reactowi (port 5174) na dostęp
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Pozwól na dostęp z Twojego frontendu
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5178",
                "http://localhost:5179"
                ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}