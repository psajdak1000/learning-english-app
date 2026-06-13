package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizQuestionResponse {
    private Long flashcardId;
    private String questionText;
    private String direction;
}
