package com.example.englishapp.controller;

import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.LoginRequest;
import com.example.englishapp.dto.UserResponse;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import com.example.englishapp.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor // To nam wstrzyknie repozytorium i encoder
// POPRAWKA PORTU: Masz 5173 na screenach, więc tu też musi być 5173
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Auth")
public class AuthController {

    private final MyAppUserRepository myAppUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
        @Operation(
            summary = "Login user",
            description = "Public endpoint. Authenticates user and returns JWT access token."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
        })
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String loginInput = request.getUsername();

        // --- DIAGNOSTYKA START ---
        System.out.println("1. Próba logowania. Otrzymany tekst: '" + loginInput + "'");
        // --- DIAGNOSTYKA KONIEC ---

        Optional<MyAppUser> userOptional = myAppUserRepository.findByUsernameOrEmail(loginInput, loginInput);

        if (userOptional.isPresent()) {
            System.out.println("2. SUKCES: Znaleziono użytkownika w bazie: " + userOptional.get().getUsername());
            MyAppUser user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String accessToken = jwtService.generateToken(
                        User.builder()
                                .username(user.getUsername())
                                .password(user.getPassword())
                                .roles("USER")
                                .build()
                );
                UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail());
                return ResponseEntity.ok(Map.of(
                        "message", "Zalogowano!",
                        "username", user.getUsername(),
                        "user", userResponse,
                        "accessToken", accessToken,
                        "tokenType", "Bearer"
                ));
            } else {
                System.out.println("3. BŁĄD: Hasło się nie zgadza.");
            }
        } else {
            System.out.println("2. BŁĄD: Nie znaleziono takiego użytkownika w bazie ani po loginie, ani po emailu.");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(buildError("Złe dane logowania", HttpStatus.UNAUTHORIZED, httpRequest));
    }

    private ErrorResponse buildError(String message, HttpStatus status, HttpServletRequest request) {
        return new ErrorResponse(
                message,
                status.value(),
                Instant.now().toString(),
                request.getRequestURI(),
                null
        );
    }
}