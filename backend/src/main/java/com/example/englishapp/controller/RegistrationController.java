package com.example.englishapp.controller;

import com.example.englishapp.dto.RegisterRequest;
import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.UserResponse;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth") // 1. Dodajemy wspólny prefiks dla endpointów związanych z autoryzacją
@CrossOrigin(origins = "http://localhost:5173") // 2. Ustawiamy CORS dla frontendu (5173 to port Vite)
@AllArgsConstructor
@Tag(name = "Auth")
public class RegistrationController {

    private final MyAppUserRepository myAppUserRepository;
    private final PasswordEncoder passwordEncoder;

    // Teraz adres to: POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
        @Operation(
            summary = "Register user",
            description = "Public endpoint. Registers a new user."
        )
        @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "409", description = "Conflict")
        })
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        if (request == null) {
            return ResponseEntity.badRequest().body(buildError("Invalid request body", HttpStatus.BAD_REQUEST, httpRequest));
        }

        String username = request.getUsername().trim();
        String email = request.getEmail().trim();
        String password = request.getPassword();

        if (myAppUserRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(buildError("Username already exists", HttpStatus.CONFLICT, httpRequest));
        }
        if (myAppUserRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(buildError("Email already exists", HttpStatus.CONFLICT, httpRequest));
        }

        MyAppUser user = new MyAppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        MyAppUser saved = myAppUserRepository.save(user);
        UserResponse response = new UserResponse(saved.getId(), saved.getUsername(), saved.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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