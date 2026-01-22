package com.example.englishapp.controller;


import com.example.englishapp.dto.ChatRequest; // Upewnij się, że masz tę klasę (z poprzedniego kroku)
import com.example.englishapp.model.HuggingFaceService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bot")
@AllArgsConstructor
public class BotController {

    private final HuggingFaceService aiService;

    @PostMapping("/ask")
    public Map<String, String> askBot(@RequestBody ChatRequest request) {
        String answer = aiService.getChatResponse(request.getQuestion());
        return Map.of("answer", answer);
    }
}