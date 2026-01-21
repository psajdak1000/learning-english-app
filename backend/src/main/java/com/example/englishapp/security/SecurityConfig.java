package com.example.englishapp.security;

import com.example.englishapp.model.MyAppUserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Dodany import
import org.springframework.security.crypto.password.PasswordEncoder;   // Dodany import
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final MyAppUserService appUserService;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserService);
        // Ustawiamy koder haseł (niezbędne, by porównać hasło z bazy z wpisanym)
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // Bean definiujący, że używamy szyfrowania BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

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

    // Konfiguracja CORS - pozwala Reactowi na dostęp
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