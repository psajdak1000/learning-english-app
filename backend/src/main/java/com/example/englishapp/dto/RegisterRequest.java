package com.example.englishapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Register request payload")
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Schema(description = "Username", example = "janek")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Schema(description = "Email", example = "janek@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "Password", example = "secret123")
    private String password;
}
