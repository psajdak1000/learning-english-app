package com.example.englishapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FlashcardRequest {

    @NotBlank(message = "English word is required")
    private String englishWord;

    @NotBlank(message = "Polish translation is required")
    private String polishTranslation;

    @NotBlank(message = "Example usage is required")
    private String exampleUsage;

    @NotBlank(message = "Difficulty level is required")
    private String difficultyLevel;

    @NotBlank(message = "Category is required")
    private String category;
}
