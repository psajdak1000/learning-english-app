package com.example.englishapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuizAnswerRequest {

    @NotNull(message = "Flashcard id is required")
    private Long flashcardId;

    @NotBlank(message = "Answer is required")
    private String answer;

    @NotBlank(message = "Direction is required")
    private String direction;
}
