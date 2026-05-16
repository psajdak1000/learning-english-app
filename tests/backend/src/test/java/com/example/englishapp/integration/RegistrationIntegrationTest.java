package com.example.englishapp.integration;

import com.example.englishapp.EnglishAppApplication;
import com.example.englishapp.dto.RegisterRequest;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testy integracyjne rejestracji.
 * Sprawdzają pełny flow rejestracji: walidację danych, zapis do bazy,
 * hashowanie hasła i obsługę duplikatów.
 */
@SpringBootTest(classes = EnglishAppApplication.class)
@AutoConfigureMockMvc
@DisplayName("Registration Integration — rejestracja")
class RegistrationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MyAppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Powinien zarejestrować nowego użytkownika i zwrócić 201")
    void shouldRegisterNewUser() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@example.com");
        request.setPassword("StrongPass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newuser"))
                .andExpect(jsonPath("$.email").value("new@example.com"))
                .andExpect(jsonPath("$.id").isNumber());

        // Sprawdzamy, że użytkownik jest w bazie
        Optional<MyAppUser> saved = userRepository.findByUsernameOrEmail("newuser", "newuser");
        assertTrue(saved.isPresent(), "Użytkownik powinien być zapisany w bazie");
        assertEquals("newuser", saved.get().getUsername());
        assertEquals("new@example.com", saved.get().getEmail());
        // Hasło powinno być zahashowane
        assertTrue(passwordEncoder.matches("StrongPass123!", saved.get().getPassword()),
                "Hasło powinno być zahashowane przez BCrypt");
    }

    @Test
    @DisplayName("Powinien zwrócić 409 dla duplikatu nazwy użytkownika")
    void shouldReturn409ForDuplicateUsername() throws Exception {
        // Najpierw tworzymy użytkownika
        MyAppUser existing = new MyAppUser();
        existing.setUsername("existinguser");
        existing.setEmail("existing@example.com");
        existing.setPassword(passwordEncoder.encode("pass"));
        userRepository.save(existing);

        // Próba rejestracji z tą samą nazwą
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setEmail("other@example.com");
        request.setPassword("NewPass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Powinien zwrócić 409 dla duplikatu emaila")
    void shouldReturn409ForDuplicateEmail() throws Exception {
        MyAppUser existing = new MyAppUser();
        existing.setUsername("user1");
        existing.setEmail("taken@example.com");
        existing.setPassword(passwordEncoder.encode("pass"));
        userRepository.save(existing);

        RegisterRequest request = new RegisterRequest();
        request.setUsername("user2");
        request.setEmail("taken@example.com");
        request.setPassword("NewPass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Powinien zwrócić 400 dla pustego username")
    void shouldReturn400ForBlankUsername() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("");
        request.setEmail("test@example.com");
        request.setPassword("Pass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Powinien zwrócić 400 dla nieprawidłowego emaila")
    void shouldReturn400ForInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user");
        request.setEmail("not-an-email");
        request.setPassword("Pass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Powinien zwrócić 400 dla pustego hasła")
    void shouldReturn400ForBlankPassword() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user");
        request.setEmail("test@example.com");
        request.setPassword("");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Powinien zwrócić 400 dla pustego body")
    void shouldReturn400ForMissingBody() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Powinien trimować username i email")
    void shouldTrimUsernameAndEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("  trimmed  ");
        request.setEmail("  trim@example.com  ");
        request.setPassword("Pass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("trimmed"));
    }
}
