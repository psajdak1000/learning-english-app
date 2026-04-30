package com.example.englishapp.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceService {

    @Value("${huggingface.api-url}")
    private String apiUrl;

    @Value("${huggingface.api-token}")
    private String apiToken;

    @Value("${huggingface.model}")
    private String model;

    // Domyślne wartości, gdybyś nie dodał do application.yml
    @Value("${huggingface.max-tokens:150}")
    private int maxTokens;

    @Value("${huggingface.temperature:0.7}")
    private double temperature;

    @Value("${huggingface.system-prompt:Jesteś nauczycielem angielskiego. Odpowiadaj krótko i jasno.}")
    private String systemPrompt;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getChatResponse(String userMessage) {
        if ("your_token_here".equals(apiToken) || apiToken == null || apiToken.isEmpty()) {
            String lowerMsg = userMessage.toLowerCase();
            if (lowerMsg.contains("hello") || lowerMsg.contains("cześć")) {
                return "Hello! I'm your English tutor. Jak mogę Ci dzisiaj pomóc w nauce angielskiego? Możesz zapytać o słówko lub poprosić o poprawienie zdania.";
            } else if (lowerMsg.contains("how are you")) {
                return "I'm doing great, thank you for asking! A Ty jak się czujesz? (How do you feel today?)";
            } else if (lowerMsg.contains("i is")) {
                return "Widzę błąd! W języku angielskim z 'I' używamy 'am'. Poprawna wersja to: **I am**. Przykład: *I am a student*.";
            } else if (lowerMsg.contains("she go")) {
                return "Uważaj na 3. osobę liczby pojedynczej (He/She/It)! Dodajemy końcówkę '-s' lub '-es'. Poprawnie: **She goes**. Przykład: *She goes to school every day*.";
            } else if (lowerMsg.contains("apple")) {
                return "**Apple** oznacza po polsku **jabłko**. \nSynonimy: fruit (ogólnie). \nPrzykład: *I eat an apple every day* (Jem jabłko każdego dnia).";
            } else if (lowerMsg.contains("present simple")) {
                return "Present Simple używamy do opisywania czynności rutynowych i faktów. \nBudowa: Podmiot + Czasownik (w 3 os. + s/es). \nPrzykład: *I drink coffee* vs *He drinks coffee*. Chcesz poćwiczyć?";
            }
            return "Witaj! Jestem Twoim nauczycielem angielskiego (tryb demo). \n\nAby otrzymać prawdziwe odpowiedzi od AI (Mistral-7B), wpisz swój klucz API w pliku `application.yml`. \n\nTwoja wiadomość: \"" + userMessage + "\" została odebrana, ale w trybie demo potrafię odpowiedzieć tylko na podstawowe frazy (jak 'hello' lub 'i is').";
        }
        try {
            // --- Headers ---
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiToken);

            // --- Body (OpenAI-compatible chat completions) ---
            List<Map<String, Object>> messages = List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userMessage)
            );

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", model);
            payload.put("messages", messages);
            payload.put("max_tokens", maxTokens);
            payload.put("temperature", temperature);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            System.out.println(">>> DEBUG: POST " + apiUrl);
            System.out.println(">>> DEBUG: model=" + model + ", max_tokens=" + maxTokens + ", temperature=" + temperature);

            ResponseEntity<Map> resp = restTemplate.postForEntity(apiUrl, request, Map.class);

            Map<?, ?> body = resp.getBody();
            if (body == null) return "Błąd: Pusta odpowiedź od modelu.";

            // --- Parse: choices[0].message.content ---
            Object choicesObj = body.get("choices");
            if (!(choicesObj instanceof List<?> choices) || choices.isEmpty()) {
                return "Błąd: Brak 'choices' w odpowiedzi: " + body;
            }

            Object firstChoiceObj = choices.get(0);
            if (!(firstChoiceObj instanceof Map<?, ?> firstChoice)) {
                return "Błąd: Nieoczekiwany format 'choices[0]': " + firstChoiceObj;
            }

            // Najczęściej: message.content
            Object messageObj = firstChoice.get("message");
            if (messageObj instanceof Map<?, ?> message) {
                Object contentObj = message.get("content");
                if (contentObj != null) return contentObj.toString();
            }

            // Fallback (gdyby kiedyś wleciał format delta)
            Object deltaObj = firstChoice.get("delta");
            if (deltaObj instanceof Map<?, ?> delta) {
                Object contentObj = delta.get("content");
                if (contentObj != null) return contentObj.toString();
            }

            return "Błąd: Brak 'message.content' w odpowiedzi: " + body;

        } catch (HttpStatusCodeException e) {
            String body = e.getResponseBodyAsString();
            return "Błąd HTTP " + e.getStatusCode().value() + " (" + e.getStatusText() + ")"
                    + (body != null && !body.isBlank() ? " | body: " + body : "");
        } catch (Exception e) {
            e.printStackTrace();
            return "Serwer AI jest przeciążony lub wystąpił błąd. (" + e.getMessage() + ")";
        }
    }
}
