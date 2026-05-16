package com.example.englishapp.unit;

import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import com.example.englishapp.model.MyAppUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Testy jednostkowe dla MyAppUserService (UserDetailsService).
 * Sprawdzają ładowanie użytkownika z repozytorium i obsługę
 * nieistniejących użytkowników.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("MyAppUserService — testy jednostkowe")
class MyAppUserServiceTest {

    @Mock
    private MyAppUserRepository repository;

    @InjectMocks
    private MyAppUserService userService;

    private MyAppUser testUser;

    @BeforeEach
    void setUp() {
        testUser = new MyAppUser();
        testUser.setId(1L);
        testUser.setUsername("janek");
        testUser.setEmail("janek@example.com");
        testUser.setPassword("$2a$10$encodedPassword");
    }

    @Test
    @DisplayName("Powinien zwrócić UserDetails dla istniejącego użytkownika (po nazwie)")
    void shouldLoadUserByUsername() {
        when(repository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(testUser));

        UserDetails result = userService.loadUserByUsername("janek");

        assertNotNull(result);
        assertEquals("janek", result.getUsername());
        assertEquals("$2a$10$encodedPassword", result.getPassword());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));

        verify(repository, times(1)).findByUsernameOrEmail("janek", "janek");
    }

    @Test
    @DisplayName("Powinien zwrócić UserDetails dla istniejącego użytkownika (po emailu)")
    void shouldLoadUserByEmail() {
        when(repository.findByUsernameOrEmail("janek@example.com", "janek@example.com"))
                .thenReturn(Optional.of(testUser));

        UserDetails result = userService.loadUserByUsername("janek@example.com");

        assertNotNull(result);
        assertEquals("janek", result.getUsername());
    }

    @Test
    @DisplayName("Powinien rzucić UsernameNotFoundException dla nieistniejącego użytkownika")
    void shouldThrowWhenUserNotFound() {
        when(repository.findByUsernameOrEmail("ghost", "ghost"))
                .thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userService.loadUserByUsername("ghost")
        );

        assertTrue(exception.getMessage().contains("ghost"));
    }

    @Test
    @DisplayName("Powinien wywoływać repozytorium dokładnie raz")
    void shouldCallRepositoryOnce() {
        when(repository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(testUser));

        userService.loadUserByUsername("janek");

        verify(repository, times(1)).findByUsernameOrEmail("janek", "janek");
        verifyNoMoreInteractions(repository);
    }

    @Test
    @DisplayName("Powinien ustawiać rolę USER")
    void shouldAssignUserRole() {
        when(repository.findByUsernameOrEmail("janek", "janek"))
                .thenReturn(Optional.of(testUser));

        UserDetails result = userService.loadUserByUsername("janek");

        assertEquals(1, result.getAuthorities().size());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }
}
