package com.example.englishapp.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserIdOrderByExecutedAtDesc(String userId);

    Optional<QuizResult> findTopByUserIdOrderByExecutedAtDesc(String userId);
}
