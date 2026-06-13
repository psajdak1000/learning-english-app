package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FlashcardResponse {
    private Long id;
    private String englishWord;
    private String polishTranslation;
    private String exampleUsage;
    private String difficultyLevel;
    private String category;
}
