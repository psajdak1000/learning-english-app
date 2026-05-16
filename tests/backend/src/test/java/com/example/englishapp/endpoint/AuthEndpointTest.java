package com.example.englishapp.endpoint;

import com.example.englishapp.controller.AuthController;
import com.example.englishapp.dto.LoginRequest;
import com.example.englishapp.exception.ApiExceptionHandler;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import com.example.englishapp.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testy endpointów AuthController.
 * Używają MockMvc bez pełnego kontekstu Springa (standalone setup).
 * Mockują repozytorium, encoder i JwtService.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController — testy endpointów")
class AuthEndpointTest {

    private MockMvc mockMvc;

    @Mock
    private MyAppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/login — powinien zwrócić 200 z tokenem")
    void loginSuccess() throws Exception {
        MyAppUser user = new MyAppUser();
        user.setId(1L);
        user.setUsername("janek");
        user.setEmail("janek@example.com");
        user.setPassword("encoded");

        when(userRepository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("test-jwt-token");

        LoginRequest request = new LoginRequest();
        request.setUsername("janek");
        request.setPassword("secret123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("test-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.username").value("janek"))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.email").value("janek@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login — powinien zwrócić 401 dla złego hasła")
    void loginWrongPassword() throws Exception {
        MyAppUser user = new MyAppUser();
        user.setId(1L);
        user.setUsername("janek");
        user.setPassword("encoded");

        when(userRepository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        LoginRequest request = new LoginRequest();
        request.setUsername("janek");
        request.setPassword("wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/login — powinien zwrócić 401 dla nieistniejącego użytkownika")
    void loginUserNotFound() throws Exception {
        when(userRepository.findByUsernameOrEmail("nobody", "nobody"))
                .thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest();
        request.setUsername("nobody");
        request.setPassword("pass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/login — powinien zwrócić 400 dla pustego body")
    void loginMissingBody() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/login — powinien zwrócić 400 dla brakujących pól")
    void loginBlankFields() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("");
        request.setPassword("");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/login — content-type musi być JSON")
    void loginWrongContentType() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("not json"))
                .andExpect(status().isUnsupportedMediaType());
    }
}
