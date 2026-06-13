package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class LearningProgressResponse {
    private Long id;
    private String userId;
    private int cardsStudied;
    private int correctAnswers;
    private int incorrectAnswers;
    private double successRate;
    private LocalDateTime lastStudyDate;
}
