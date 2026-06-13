package com.example.englishapp.controller;

import com.example.englishapp.dto.ChatRequest;
import com.example.englishapp.model.HuggingFaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/bot")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@AllArgsConstructor
@Tag(name = "Bot")
public class BotController {

    private final HuggingFaceService aiService;

    @PostMapping("/ask")
    @Operation(
            summary = "Ask AI bot",
            description = "Sends a question to the AI bot."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public Map<String, String> askBot(@Valid @RequestBody ChatRequest request) {
        String answer = aiService.getChatResponse(request.getQuestion());
        return Map.of("answer", answer);
    }
}
