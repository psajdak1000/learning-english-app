package com.example.englishapp.controller;


import com.example.englishapp.dto.ChatRequest; // Upewnij się, że masz tę klasę (z poprzedniego kroku)
import com.example.englishapp.model.HuggingFaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bot")
@AllArgsConstructor
@Tag(name = "Bot")
public class BotController {

    private final HuggingFaceService aiService;

    @PostMapping("/ask")
    @Operation(
            summary = "Ask AI bot",
            description = "Sends a question to the AI bot. Requires Authorization: Bearer <token>."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public Map<String, String> askBot(@RequestBody ChatRequest request) {
        String answer = aiService.getChatResponse(request.getQuestion());
        return Map.of("answer", answer);
    }
}