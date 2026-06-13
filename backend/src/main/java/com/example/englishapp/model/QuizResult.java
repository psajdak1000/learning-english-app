package com.example.englishapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "quiz_results")
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private LocalDateTime executedAt;
    private int questionCount;
    private int correctAnswers;
    private double percentageScore;

    @PrePersist
    public void setDefaults() {
        if (executedAt == null) {
            executedAt = LocalDateTime.now();
        }
    }
}
