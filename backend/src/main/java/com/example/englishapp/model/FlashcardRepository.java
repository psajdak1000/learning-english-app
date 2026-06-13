package com.example.englishapp.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByCategoryIgnoreCase(String category);

    List<Flashcard> findByDifficultyLevelIgnoreCase(String difficultyLevel);

    List<Flashcard> findByCategoryIgnoreCaseAndDifficultyLevelIgnoreCase(String category, String difficultyLevel);
}
