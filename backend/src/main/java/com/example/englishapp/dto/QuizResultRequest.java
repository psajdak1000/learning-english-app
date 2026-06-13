package com.example.englishapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuizResultRequest {
    private String userId;

    @NotNull(message = "Question count is required")
    @Min(value = 1, message = "Question count must be at least 1")
    private Integer questionCount;

    @NotNull(message = "Correct answers are required")
    @Min(value = 0, message = "Correct answers cannot be negative")
    private Integer correctAnswers;

    @Min(value = 0, message = "Percentage score cannot be negative")
    @Max(value = 100, message = "Percentage score cannot exceed 100")
    private Double percentageScore;
}
