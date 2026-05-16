package com.example.englishapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Error response payload")
public class ErrorResponse {
    @Schema(description = "Error message", example = "Unauthorized")
    private String message;
    @Schema(description = "HTTP status code", example = "401")
    private int status;
    @Schema(description = "Timestamp in ISO-8601", example = "2026-05-02T15:51:00Z")
    private String timestamp;
    @Schema(description = "Request path", example = "/api/users/me")
    private String path;
    @Schema(description = "Field validation errors")
    private Map<String, String> fieldErrors;
}
