package com.example.englishapp.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;

    // Gettery i Settery (wymagane, żeby Spring mógł wpakować tu dane z JSONa)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
