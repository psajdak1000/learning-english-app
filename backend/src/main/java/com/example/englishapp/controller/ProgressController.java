package com.example.englishapp.controller;

import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.LearningProgressResponse;
import com.example.englishapp.dto.ProgressUpdateRequest;
import com.example.englishapp.model.LearningProgress;
import com.example.englishapp.model.LearningProgressRepository;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
@Tag(name = "Progress")
public class ProgressController {

    private static final String DEFAULT_USER_ID = "demo-user";
    private final LearningProgressRepository learningProgressRepository;

    @GetMapping
    @Operation(summary = "Get progress", description = "Returns progress for query param userId or demo-user if missing.")
    @ApiResponse(responseCode = "200", description = "OK")
    public ResponseEntity<LearningProgressResponse> getProgress(
            @RequestParam(required = false) String userId
    ) {
        String normalizedUserId = sanitizeUserId(userId);
        LearningProgress progress = learningProgressRepository.findByUserId(normalizedUserId)
                .orElseGet(() -> buildEmptyProgress(normalizedUserId));

        return ResponseEntity.ok(toResponse(progress));
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get progress by user id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    public ResponseEntity<?> getProgressByUserId(
            @PathVariable String userId,
            HttpServletRequest request
    ) {
        Optional<LearningProgress> progressOptional = learningProgressRepository.findByUserId(userId);
        if (progressOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildError("Progress not found", HttpStatus.NOT_FOUND, request));
        }

        return ResponseEntity.ok(toResponse(progressOptional.get()));
    }

    @PostMapping("/update")
    @Operation(summary = "Update progress", description = "Updates progress counters for a selected user.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<LearningProgressResponse> updateProgress(
            @Valid @RequestBody ProgressUpdateRequest request
    ) {
        String userId = sanitizeUserId(request.getUserId());
        LearningProgress progress = learningProgressRepository.findByUserId(userId)
                .orElseGet(() -> {
                    LearningProgress newProgress = new LearningProgress();
                    newProgress.setUserId(userId);
                    return newProgress;
                });

        progress.setCardsStudied(progress.getCardsStudied() + request.getCardsStudied());
        progress.setCorrectAnswers(progress.getCorrectAnswers() + request.getCorrectAnswers());
        progress.setIncorrectAnswers(progress.getIncorrectAnswers() + request.getIncorrectAnswers());

        int totalAnswers = progress.getCorrectAnswers() + progress.getIncorrectAnswers();
        double successRate = totalAnswers == 0 ? 0.0 : roundTwoDecimals((progress.getCorrectAnswers() * 100.0) / totalAnswers);
        progress.setSuccessRate(successRate);
        progress.setLastStudyDate(LocalDateTime.now());

        LearningProgress saved = learningProgressRepository.save(progress);
        return ResponseEntity.ok(toResponse(saved));
    }

    private LearningProgress buildEmptyProgress(String userId) {
        LearningProgress progress = new LearningProgress();
        progress.setUserId(userId);
        progress.setCardsStudied(0);
        progress.setCorrectAnswers(0);
        progress.setIncorrectAnswers(0);
        progress.setSuccessRate(0.0);
        progress.setLastStudyDate(null);
        return progress;
    }

    private String sanitizeUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            return DEFAULT_USER_ID;
        }
        return userId.trim();
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private LearningProgressResponse toResponse(LearningProgress progress) {
        return new LearningProgressResponse(
                progress.getId(),
                progress.getUserId(),
                progress.getCardsStudied(),
                progress.getCorrectAnswers(),
                progress.getIncorrectAnswers(),
                progress.getSuccessRate(),
                progress.getLastStudyDate()
        );
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
