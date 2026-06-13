package com.example.englishapp.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ProgressUpdateRequest {
    private String userId;

    @Min(value = 0, message = "Cards studied cannot be negative")
    private int cardsStudied;

    @Min(value = 0, message = "Correct answers cannot be negative")
    private int correctAnswers;

    @Min(value = 0, message = "Incorrect answers cannot be negative")
    private int incorrectAnswers;
}
