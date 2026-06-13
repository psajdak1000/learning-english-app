package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuizStartResponse {
    private int totalQuestions;
    private List<QuizQuestionResponse> questions;
}
