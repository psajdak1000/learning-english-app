package com.example.englishapp.controller;

import com.example.englishapp.dto.ErrorResponse;
import com.example.englishapp.dto.FlashcardRequest;
import com.example.englishapp.dto.FlashcardResponse;
import com.example.englishapp.model.Flashcard;
import com.example.englishapp.model.FlashcardRepository;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
@Tag(name = "Flashcards")
public class FlashcardController {

    private final FlashcardRepository flashcardRepository;

    @GetMapping
    @Operation(summary = "Get flashcards", description = "Returns all flashcards or filters by category/difficulty level.")
    @ApiResponse(responseCode = "200", description = "OK")
    public ResponseEntity<List<FlashcardResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficultyLevel
    ) {
        List<Flashcard> flashcards;
        boolean hasCategory = StringUtils.hasText(category);
        boolean hasDifficulty = StringUtils.hasText(difficultyLevel);

        if (hasCategory && hasDifficulty) {
            flashcards = flashcardRepository.findByCategoryIgnoreCaseAndDifficultyLevelIgnoreCase(
                    category.trim(),
                    difficultyLevel.trim()
            );
        } else if (hasCategory) {
            flashcards = flashcardRepository.findByCategoryIgnoreCase(category.trim());
        } else if (hasDifficulty) {
            flashcards = flashcardRepository.findByDifficultyLevelIgnoreCase(difficultyLevel.trim());
        } else {
            flashcards = flashcardRepository.findAll();
        }

        return ResponseEntity.ok(flashcards.stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get flashcard by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    public ResponseEntity<?> getById(@PathVariable Long id, HttpServletRequest request) {
        Optional<Flashcard> flashcardOptional = flashcardRepository.findById(id);
        if (flashcardOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildError("Flashcard not found", HttpStatus.NOT_FOUND, request));
        }

        return ResponseEntity.ok(toResponse(flashcardOptional.get()));
    }

    @PostMapping
    @Operation(summary = "Create flashcard")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<FlashcardResponse> create(
            @Valid @RequestBody FlashcardRequest request
    ) {
        Flashcard flashcard = new Flashcard();
        applyRequest(flashcard, request);
        Flashcard saved = flashcardRepository.save(flashcard);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update flashcard")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody FlashcardRequest request,
            HttpServletRequest httpRequest
    ) {
        Optional<Flashcard> flashcardOptional = flashcardRepository.findById(id);
        if (flashcardOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildError("Flashcard not found", HttpStatus.NOT_FOUND, httpRequest));
        }

        Flashcard flashcard = flashcardOptional.get();
        applyRequest(flashcard, request);
        Flashcard updated = flashcardRepository.save(flashcard);
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete flashcard")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "No Content"),
            @ApiResponse(responseCode = "404", description = "Not Found")
    })
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        Optional<Flashcard> flashcardOptional = flashcardRepository.findById(id);
        if (flashcardOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(buildError("Flashcard not found", HttpStatus.NOT_FOUND, request));
        }

        flashcardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyRequest(Flashcard flashcard, FlashcardRequest request) {
        flashcard.setEnglishWord(request.getEnglishWord().trim());
        flashcard.setPolishTranslation(request.getPolishTranslation().trim());
        flashcard.setExampleUsage(request.getExampleUsage().trim());
        flashcard.setDifficultyLevel(request.getDifficultyLevel().trim());
        flashcard.setCategory(request.getCategory().trim());
    }

    private FlashcardResponse toResponse(Flashcard flashcard) {
        return new FlashcardResponse(
                flashcard.getId(),
                flashcard.getEnglishWord(),
                flashcard.getPolishTranslation(),
                flashcard.getExampleUsage(),
                flashcard.getDifficultyLevel(),
                flashcard.getCategory()
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
