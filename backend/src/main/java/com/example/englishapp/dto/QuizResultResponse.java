package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class QuizResultResponse {
    private Long id;
    private String userId;
    private LocalDateTime executedAt;
    private int questionCount;
    private int correctAnswers;
    private double percentageScore;
}
