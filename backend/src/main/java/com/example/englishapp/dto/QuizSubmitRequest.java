package com.example.englishapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class QuizSubmitRequest {
    private String userId;

    @Valid
    @NotEmpty(message = "Answers are required")
    private List<QuizAnswerRequest> answers;
}
