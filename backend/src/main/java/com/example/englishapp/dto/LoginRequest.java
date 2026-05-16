package com.example.englishapp.dto;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Login request payload")
public class LoginRequest {
    @NotBlank(message = "Username is required")
    @Schema(description = "Username or email", example = "janek")
    private String username;

    @NotBlank(message = "Password is required")
    @Schema(description = "Password", example = "secret123")
    private String password;

    // Gettery i Settery (wymagane, żeby Spring mógł wpakować tu dane z JSONa)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
