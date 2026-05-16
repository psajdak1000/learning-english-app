package com.example.englishapp.controller;

import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.UserResponse;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final MyAppUserRepository myAppUserRepository;

    @GetMapping("/me")
        @Operation(
            summary = "Get current user",
            description = "Returns the currently authenticated user. Requires Authorization: Bearer <token>."
        )
        @SecurityRequirement(name = "bearerAuth")
        @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Not Found")
        })
    public ResponseEntity<?> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(buildError("Unauthorized", HttpStatus.UNAUTHORIZED, request));
        }

        String username = authentication.getName();
        Optional<MyAppUser> userOptional = myAppUserRepository.findByUsernameOrEmail(username, username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildError("User not found", HttpStatus.NOT_FOUND, request));
        }

        MyAppUser user = userOptional.get();
        UserResponse response = new UserResponse(user.getId(), user.getUsername(), user.getEmail());
        return ResponseEntity.ok(response);
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
