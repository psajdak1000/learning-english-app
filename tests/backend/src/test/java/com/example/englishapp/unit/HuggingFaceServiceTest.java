package com.example.englishapp.unit;

import com.example.englishapp.model.HuggingFaceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testy jednostkowe dla HuggingFaceService.
 * Testują konfigurację serwisu i obsługę błędów bez
 * rzeczywistego wywoływania zewnętrznego API.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("HuggingFaceService — testy jednostkowe")
class HuggingFaceServiceTest {

    @InjectMocks
    private HuggingFaceService huggingFaceService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(huggingFaceService, "apiUrl", "https://fake-api.test/v1/chat/completions");
        ReflectionTestUtils.setField(huggingFaceService, "apiToken", "test-token");
        ReflectionTestUtils.setField(huggingFaceService, "model", "test-model");
        ReflectionTestUtils.setField(huggingFaceService, "maxTokens", 50);
        ReflectionTestUtils.setField(huggingFaceService, "temperature", 0.5);
        ReflectionTestUtils.setField(huggingFaceService, "systemPrompt", "Test prompt");
    }

    @Test
    @DisplayName("Powinien zwrócić komunikat błędu gdy API jest niedostępne")
    void shouldReturnErrorMessageWhenApiUnavailable() {
        // RestTemplate próbuje połączyć się z fake URL — dostaniemy błąd
        String result = huggingFaceService.getChatResponse("Hello");

        assertNotNull(result, "Odpowiedź nie powinna być null");
        // Serwis łapie wyjątki i zwraca komunikat zamiast rzucać
        assertTrue(result.contains("Serwer AI") || result.contains("Błąd"),
                "Powinien zwrócić komunikat o błędzie, ale dostaliśmy: " + result);
    }

    @Test
    @DisplayName("Powinien obsłużyć pustą wiadomość użytkownika")
    void shouldHandleEmptyMessage() {
        String result = huggingFaceService.getChatResponse("");

        assertNotNull(result, "Odpowiedź nie powinna być null nawet dla pustej wiadomości");
    }

    @Test
    @DisplayName("Powinien obsłużyć null jako wiadomość")
    void shouldHandleNullMessage() {
        // Serwis powinien obsłużyć null bez rzucania NPE
        assertDoesNotThrow(() -> {
            String result = huggingFaceService.getChatResponse(null);
            assertNotNull(result);
        });
    }

    @Test
    @DisplayName("Konfiguracja serwisu powinna mieć poprawne wartości")
    void shouldHaveCorrectConfig() {
        String apiUrl = (String) ReflectionTestUtils.getField(huggingFaceService, "apiUrl");
        String model = (String) ReflectionTestUtils.getField(huggingFaceService, "model");
        int maxTokens = (int) ReflectionTestUtils.getField(huggingFaceService, "maxTokens");
        double temperature = (double) ReflectionTestUtils.getField(huggingFaceService, "temperature");

        assertEquals("https://fake-api.test/v1/chat/completions", apiUrl);
        assertEquals("test-model", model);
        assertEquals(50, maxTokens);
        assertEquals(0.5, temperature, 0.001);
    }
}
