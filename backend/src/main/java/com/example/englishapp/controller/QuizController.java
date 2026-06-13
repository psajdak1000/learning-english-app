package com.example.englishapp.controller;

import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.QuizAnswerRequest;
import com.example.englishapp.dto.QuizQuestionResponse;
import com.example.englishapp.dto.QuizStartResponse;
import com.example.englishapp.dto.QuizSubmitRequest;
import com.example.englishapp.dto.QuizSubmitResponse;
import com.example.englishapp.model.Flashcard;
import com.example.englishapp.model.FlashcardRepository;
import com.example.englishapp.model.LearningProgress;
import com.example.englishapp.model.LearningProgressRepository;
import com.example.englishapp.model.QuizResult;
import com.example.englishapp.model.QuizResultRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
@Tag(name = "Quizzes")
public class QuizController {

    private static final String EN_TO_PL = "EN_TO_PL";
    private static final String PL_TO_EN = "PL_TO_EN";
    private static final String DEFAULT_USER_ID = "demo-user";

    private final FlashcardRepository flashcardRepository;
    private final LearningProgressRepository learningProgressRepository;
    private final QuizResultRepository quizResultRepository;

    @GetMapping("/start")
    @Operation(summary = "Start quiz", description = "Returns random quiz questions generated from flashcards.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<?> startQuiz(
            @RequestParam(defaultValue = "5") int count,
            @RequestParam(defaultValue = EN_TO_PL) String direction,
            HttpServletRequest request
    ) {
        if (count <= 0) {
            return ResponseEntity.badRequest()
                    .body(buildError("Count must be greater than 0", HttpStatus.BAD_REQUEST, request));
        }

        String normalizedDirection = normalizeDirection(direction);
        if (normalizedDirection == null) {
            return ResponseEntity.badRequest()
                    .body(buildError("Direction must be EN_TO_PL or PL_TO_EN", HttpStatus.BAD_REQUEST, request));
        }

        List<Flashcard> flashcards = flashcardRepository.findAll();
        if (flashcards.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(buildError("No flashcards available to start quiz", HttpStatus.BAD_REQUEST, request));
        }

        Collections.shuffle(flashcards);
        int total = Math.min(count, flashcards.size());

        List<QuizQuestionResponse> questions = flashcards.stream()
                .limit(total)
                .map(flashcard -> toQuestion(flashcard, normalizedDirection))
                .toList();

        return ResponseEntity.ok(new QuizStartResponse(total, questions));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit quiz answers", description = "Checks answers and returns quiz score.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<?> submitQuiz(
            @Valid @RequestBody QuizSubmitRequest request,
            HttpServletRequest httpRequest
    ) {
        String userId = sanitizeUserId(request.getUserId());

        int totalQuestions = request.getAnswers().size();
        int correctAnswers = 0;

        for (QuizAnswerRequest answerRequest : request.getAnswers()) {
            Optional<Flashcard> flashcardOptional = flashcardRepository.findById(answerRequest.getFlashcardId());
            if (flashcardOptional.isEmpty()) {
                continue;
            }

            Flashcard flashcard = flashcardOptional.get();
            String direction = normalizeDirection(answerRequest.getDirection());
            if (direction == null) {
                continue;
            }

            String expected = direction.equals(PL_TO_EN)
                    ? flashcard.getEnglishWord()
                    : flashcard.getPolishTranslation();

            if (normalizeText(expected).equals(normalizeText(answerRequest.getAnswer()))) {
                correctAnswers++;
            }
        }

        double percentage = totalQuestions == 0 ? 0.0 : roundTwoDecimals((correctAnswers * 100.0) / totalQuestions);

        saveResult(userId, totalQuestions, correctAnswers, percentage);
        updateProgress(userId, totalQuestions, correctAnswers);

        return ResponseEntity.ok(new QuizSubmitResponse(totalQuestions, correctAnswers, percentage));
    }

    private void saveResult(String userId, int totalQuestions, int correctAnswers, double percentage) {
        QuizResult result = new QuizResult();
        result.setUserId(userId);
        result.setQuestionCount(totalQuestions);
        result.setCorrectAnswers(correctAnswers);
        result.setPercentageScore(percentage);
        quizResultRepository.save(result);
    }

    private void updateProgress(String userId, int totalQuestions, int correctAnswers) {
        LearningProgress progress = learningProgressRepository.findByUserId(userId)
                .orElseGet(() -> {
                    LearningProgress newProgress = new LearningProgress();
                    newProgress.setUserId(userId);
                    return newProgress;
                });

        int incorrectAnswers = Math.max(totalQuestions - correctAnswers, 0);
        progress.setCardsStudied(progress.getCardsStudied() + totalQuestions);
        progress.setCorrectAnswers(progress.getCorrectAnswers() + correctAnswers);
        progress.setIncorrectAnswers(progress.getIncorrectAnswers() + incorrectAnswers);

        int allAnswers = progress.getCorrectAnswers() + progress.getIncorrectAnswers();
        double successRate = allAnswers == 0 ? 0.0 : roundTwoDecimals((progress.getCorrectAnswers() * 100.0) / allAnswers);

        progress.setSuccessRate(successRate);
        progress.setLastStudyDate(LocalDateTime.now());
        learningProgressRepository.save(progress);
    }

    private QuizQuestionResponse toQuestion(Flashcard flashcard, String direction) {
        String questionText = direction.equals(PL_TO_EN)
                ? flashcard.getPolishTranslation()
                : flashcard.getEnglishWord();
        return new QuizQuestionResponse(flashcard.getId(), questionText, direction);
    }

    private String sanitizeUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            return DEFAULT_USER_ID;
        }
        return userId.trim();
    }

    private String normalizeDirection(String direction) {
        if (!StringUtils.hasText(direction)) {
            return EN_TO_PL;
        }

        String normalized = direction.trim().toUpperCase(Locale.ROOT);
        if (EN_TO_PL.equals(normalized) || PL_TO_EN.equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String normalizeText(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private ErrorResponse buildError(String message, HttpStatus status, HttpServletRequest request) {
        return new ErrorResponse(
                message,
                status.value(),
                Instant.now().toString(),
                request.getRequestURI(),
                null
        );
    }
}
