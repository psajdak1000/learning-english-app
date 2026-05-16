package com.example.englishapp.endpoint;

import com.example.englishapp.controller.UserController;
import com.example.englishapp.exception.ApiExceptionHandler;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testy endpointów UserController.
 * Testują endpoint /api/users/me z różnymi stanami uwierzytelnienia.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserController — testy endpointów")
class UserEndpointTest {

    private MockMvc mockMvc;

    @Mock
    private MyAppUserRepository userRepository;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(userController)
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/users/me — powinien zwrócić dane zalogowanego użytkownika")
    void getMeSuccess() throws Exception {
        MyAppUser user = new MyAppUser();
        user.setId(1L);
        user.setUsername("janek");
        user.setEmail("janek@example.com");

        when(userRepository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(user));

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "janek", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        mockMvc.perform(get("/api/users/me")
                        .principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("janek"))
                .andExpect(jsonPath("$.email").value("janek@example.com"));
    }

    @Test
    @DisplayName("GET /api/users/me — powinien zwrócić 401 bez uwierzytelnienia")
    void getMeUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/users/me — powinien zwrócić 404 gdy użytkownik nie istnieje w bazie")
    void getMeUserNotInDb() throws Exception {
        when(userRepository.findByUsernameOrEmail("ghost", "ghost"))
                .thenReturn(Optional.empty());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "ghost", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        mockMvc.perform(get("/api/users/me")
                        .principal(auth))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/users/me — odpowiedź nie powinna zawierać hasła")
    void getMeShouldNotExposePassword() throws Exception {
        MyAppUser user = new MyAppUser();
        user.setId(1L);
        user.setUsername("janek");
        user.setEmail("janek@example.com");
        user.setPassword("$2a$10$secret_hash");

        when(userRepository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(user));

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "janek", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        mockMvc.perform(get("/api/users/me")
                        .principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist());
    }
}
