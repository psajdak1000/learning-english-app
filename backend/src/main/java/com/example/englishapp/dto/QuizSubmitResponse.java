package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizSubmitResponse {
    private int totalQuestions;
    private int correctAnswers;
    private double percentage;
}
