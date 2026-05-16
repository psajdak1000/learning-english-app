package com.example.englishapp.unit;

import com.example.englishapp.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testy jednostkowe dla JwtService.
 * Sprawdzają generowanie tokenów, ekstrakcję nazwy użytkownika,
 * walidację tokenów oraz obsługę wygasłych tokenów.
 */
@DisplayName("JwtService — testy jednostkowe")
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails testUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Wstrzykujemy wartości konfiguracyjne bez kontekstu Springa
        ReflectionTestUtils.setField(jwtService, "secret",
                "test-secret-key-that-is-at-least-32-bytes-long-for-hmac-sha");
        ReflectionTestUtils.setField(jwtService, "expirationSeconds", 3600L);

        testUser = User.builder()
                .username("janek")
                .password("encoded-password")
                .roles("USER")
                .build();
    }

    @Test
    @DisplayName("Powinien wygenerować niepusty token JWT")
    void shouldGenerateToken() {
        String token = jwtService.generateToken(testUser);

        assertNotNull(token, "Token nie powinien być null");
        assertFalse(token.isBlank(), "Token nie powinien być pusty");
        // JWT składa się z 3 części oddzielonych kropką
        assertEquals(3, token.split("\\.").length, "Token JWT powinien mieć 3 części");
    }

    @Test
    @DisplayName("Powinien wyciągnąć poprawną nazwę użytkownika z tokenu")
    void shouldExtractUsername() {
        String token = jwtService.generateToken(testUser);

        String extractedUsername = jwtService.extractUsername(token);

        assertEquals("janek", extractedUsername);
    }

    @Test
    @DisplayName("Powinien zwalidować poprawny token jako ważny")
    void shouldValidateCorrectToken() {
        String token = jwtService.generateToken(testUser);

        boolean isValid = jwtService.isTokenValid(token, testUser);

        assertTrue(isValid, "Token powinien być ważny dla właściwego użytkownika");
    }

    @Test
    @DisplayName("Powinien odrzucić token wygenerowany dla innego użytkownika")
    void shouldRejectTokenForDifferentUser() {
        String token = jwtService.generateToken(testUser);

        UserDetails otherUser = User.builder()
                .username("kowalski")
                .password("other-pass")
                .roles("USER")
                .build();

        boolean isValid = jwtService.isTokenValid(token, otherUser);

        assertFalse(isValid, "Token nie powinien być ważny dla innego użytkownika");
    }

    @Test
    @DisplayName("Powinien odrzucić wygasły token")
    void shouldRejectExpiredToken() {
        // Ustawiamy czas wygaśnięcia na 0 sekund
        ReflectionTestUtils.setField(jwtService, "expirationSeconds", 0L);

        String token = jwtService.generateToken(testUser);

        // Token natychmiast wygasa
        boolean isValid = jwtService.isTokenValid(token, testUser);

        assertFalse(isValid, "Wygasły token nie powinien być ważny");
    }

    @Test
    @DisplayName("Powinien rzucić wyjątek dla nieprawidłowego tokenu")
    void shouldThrowForInvalidToken() {
        assertThrows(Exception.class, () -> jwtService.extractUsername("invalid.token.string"));
    }

    @Test
    @DisplayName("Powinien generować różne tokeny dla różnych użytkowników")
    void shouldGenerateDifferentTokensForDifferentUsers() {
        UserDetails user2 = User.builder()
                .username("anna")
                .password("pass")
                .roles("USER")
                .build();

        String token1 = jwtService.generateToken(testUser);
        String token2 = jwtService.generateToken(user2);

        assertNotEquals(token1, token2, "Tokeny powinny być różne dla różnych użytkowników");
    }
}
