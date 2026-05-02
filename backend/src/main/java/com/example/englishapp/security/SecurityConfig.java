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
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final MyAppUserService appUserService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    /**
     * BEAN 1: Dostawca uwierzytelniania.
     * Mówi Springowi, skąd brać użytkowników (z bazy przez appUserService)
     * i jak sprawdzać hasła (przez BCrypt).
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * BEAN 2: Szyfrowanie haseł.
     * BCrypt to standard przemysłowy - bezpieczny i sprawdzony.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * BEAN 3: Główny filtr bezpieczeństwa (Serce Security).
     * To tutaj decydujemy, kto gdzie może wejść.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Wyłączamy CSRF, bo przy REST API (stateless) nie jest potrzebny, a blokowałby POSTy.
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Włączamy CORS, żeby React (inny port) mógł pytać Springa.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2a. API bezstanowe (JWT w nagłówku Authorization)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 2b. Spójny response dla 401
                .exceptionHandling(ex -> ex.authenticationEntryPoint(restAuthenticationEntryPoint))

                // 3. ZASADY DOSTĘPU (Tu zmieniasz najczęściej!)
                .authorizeHttpRequests(auth -> auth
                        // --- STREFA PUBLICZNA (Dostępna dla każdego) ---
                        // Logowanie i Rejestracja
                        .requestMatchers("/api/auth/**").permitAll()

                        // Endpointy WebSocket (jeśli kiedyś dodasz czat na żywo z ludźmi)
                        .requestMatchers("/ws/**").permitAll()

                        // --- STREFA PRYWATNA (Wymaga zalogowania) ---
                        // Każde inne zapytanie, którego nie wymieniłeś wyżej, wymaga bycia zalogowanym.
                        .anyRequest().authenticated()
                    )

                    // 4. JWT filter przed standardowym filtrem logowania
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * BEAN 4: Konfiguracja CORS.
     * Pozwala na połączenie Frontend <-> Backend.
     */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Lista dozwolonych adresów Frontendu (localhosty Reacta/Vite)
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173", // Domyślny Vite
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5178",
                "http://localhost:5179",
                "http://localhost:3000"  // Domyślny React (na wszelki wypadek)
        ));

        // Pozwalamy na wszystkie metody (GET, POST, PUT, DELETE...)
        configuration.setAllowedMethods(List.of("*"));

        // Pozwalamy na wszystkie nagłówki (np. Authorization, Content-Type)
        configuration.setAllowedHeaders(List.of("*"));

        // Pozwalamy przesyłać ciasteczka/poświadczenia
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Zastosuj te zasady do wszystkich ścieżek w aplikacji
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}