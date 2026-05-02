package com.example.englishapp.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "Chat request payload")
public class ChatRequest {
    @Schema(description = "User question for the AI bot", example = "How do I say 'dzień dobry' in English?")
    private String question;
}