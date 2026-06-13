package com.example.englishapp.controller;

import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.QuizResultRequest;
import com.example.englishapp.dto.QuizResultResponse;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
@Tag(name = "Results")
public class ResultController {

    private static final String DEFAULT_USER_ID = "demo-user";

    private final QuizResultRepository quizResultRepository;

    @PostMapping
    @Operation(summary = "Save quiz result")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<?> saveResult(
            @Valid @RequestBody QuizResultRequest request,
            HttpServletRequest httpRequest
    ) {
        if (request.getCorrectAnswers() > request.getQuestionCount()) {
            return ResponseEntity.badRequest()
                    .body(buildError("Correct answers cannot exceed question count", HttpStatus.BAD_REQUEST, httpRequest));
        }

        String userId = sanitizeUserId(request.getUserId());
        double percentage = request.getPercentageScore() != null
                ? request.getPercentageScore()
                : roundTwoDecimals((request.getCorrectAnswers() * 100.0) / request.getQuestionCount());

        QuizResult result = new QuizResult();
        result.setUserId(userId);
        result.setQuestionCount(request.getQuestionCount());
        result.setCorrectAnswers(request.getCorrectAnswers());
        result.setPercentageScore(percentage);

        QuizResult saved = quizResultRepository.save(result);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @GetMapping("/history/{userId}")
    @Operation(summary = "Get user result history")
    @ApiResponse(responseCode = "200", description = "OK")
    public ResponseEntity<List<QuizResultResponse>> getHistory(@PathVariable String userId) {
        List<QuizResultResponse> history = quizResultRepository.findByUserIdOrderByExecutedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(history);
    }

    @GetMapping("/latest/{userId}")
    @Operation(summary = "Get latest user result")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    public ResponseEntity<?> getLatest(
            @PathVariable String userId,
            HttpServletRequest request
    ) {
        Optional<QuizResult> latestOptional = quizResultRepository.findTopByUserIdOrderByExecutedAtDesc(userId);
        if (latestOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildError("No results found for user", HttpStatus.NOT_FOUND, request));
        }

        return ResponseEntity.ok(toResponse(latestOptional.get()));
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

    private QuizResultResponse toResponse(QuizResult result) {
        return new QuizResultResponse(
                result.getId(),
                result.getUserId(),
                result.getExecutedAt(),
                result.getQuestionCount(),
                result.getCorrectAnswers(),
                roundTwoDecimals(result.getPercentageScore())
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
