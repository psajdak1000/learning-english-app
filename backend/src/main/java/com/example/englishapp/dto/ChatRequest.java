package com.example.englishapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Chat request payload")
public class ChatRequest {
    @NotBlank(message = "Question is required")
    @Schema(description = "User question for the AI bot", example = "Explain the difference between borrow and lend")
    private String question;
}
