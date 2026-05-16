package com.example.englishapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "User response payload")
public class UserResponse {
    @Schema(description = "User id", example = "1")
    private Long id;
    @Schema(description = "Username", example = "janek")
    private String username;
    @Schema(description = "Email", example = "janek@example.com")
    private String email;
}
