package com.example.englishapp.endpoint;

import com.example.englishapp.controller.BotController;
import com.example.englishapp.dto.ChatRequest;
import com.example.englishapp.exception.ApiExceptionHandler;
import com.example.englishapp.model.HuggingFaceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testy endpointów BotController.
 * Mockują HuggingFaceService i testują odpowiedzi kontrolera.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("BotController — testy endpointów")
class BotEndpointTest {

    private MockMvc mockMvc;

    @Mock
    private HuggingFaceService huggingFaceService;

    @InjectMocks
    private BotController botController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(botController)
                .setControllerAdvice(new ApiExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/bot/ask — powinien zwrócić odpowiedź bota")
    void askBotSuccess() throws Exception {
        when(huggingFaceService.getChatResponse("What is 'hello'?"))
                .thenReturn("'Hello' to po polsku 'cześć'.");

        ChatRequest request = new ChatRequest();
        request.setQuestion("What is 'hello'?");

        mockMvc.perform(post("/api/bot/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("'Hello' to po polsku 'cześć'."));

        verify(huggingFaceService, times(1)).getChatResponse("What is 'hello'?");
    }

    @Test
    @DisplayName("POST /api/bot/ask — powinien obsłużyć pustą wiadomość")
    void askBotEmptyQuestion() throws Exception {
        when(huggingFaceService.getChatResponse(""))
                .thenReturn("Proszę zadać pytanie.");

        ChatRequest request = new ChatRequest();
        request.setQuestion("");

        mockMvc.perform(post("/api/bot/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Proszę zadać pytanie."));
    }

    @Test
    @DisplayName("POST /api/bot/ask — powinien obsłużyć błąd serwisu AI")
    void askBotServiceError() throws Exception {
        when(huggingFaceService.getChatResponse("test"))
                .thenReturn("Serwer AI jest przeciążony lub wystąpił błąd. (Connection refused)");

        ChatRequest request = new ChatRequest();
        request.setQuestion("test");

        mockMvc.perform(post("/api/bot/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").isString());
    }

    @Test
    @DisplayName("POST /api/bot/ask — powinien zwrócić 400 dla brakującego body")
    void askBotMissingBody() throws Exception {
        mockMvc.perform(post("/api/bot/ask")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/bot/ask — odpowiedź powinna zawierać klucz 'answer'")
    void askBotResponseStructure() throws Exception {
        when(huggingFaceService.getChatResponse("Hi"))
                .thenReturn("Cześć!");

        ChatRequest request = new ChatRequest();
        request.setQuestion("Hi");

        mockMvc.perform(post("/api/bot/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").exists())
                .andExpect(jsonPath("$.answer").isString());
    }
}
