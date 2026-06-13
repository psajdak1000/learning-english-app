package com.example.englishapp.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
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

    @Value("${huggingface.max-tokens:180}")
    private int maxTokens;

    @Value("${huggingface.temperature:0.7}")
    private double temperature;

    @Value("${huggingface.system-prompt:Jestes nauczycielem jezyka angielskiego. Odpowiadaj krotko i jasno.}")
    private String systemPrompt;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getChatResponse(String userMessage) {
        if (!StringUtils.hasText(apiToken)) {
            return "Brak tokena Hugging Face. Ustaw HUGGINGFACE_API_TOKEN.";
        }

        if (!StringUtils.hasText(userMessage)) {
            return "Pytanie jest puste. Podaj tresc pytania.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiToken);

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
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);
            Map<?, ?> body = response.getBody();

            if (body == null) {
                return "Brak odpowiedzi od modelu Hugging Face.";
            }

            Object choicesObj = body.get("choices");
            if (!(choicesObj instanceof List<?> choices) || choices.isEmpty()) {
                return "Nieprawidlowy format odpowiedzi z Hugging Face (brak choices).";
            }

            Object firstChoiceObj = choices.get(0);
            if (!(firstChoiceObj instanceof Map<?, ?> firstChoice)) {
                return "Nieprawidlowy format odpowiedzi z Hugging Face (choices[0]).";
            }

            Object messageObj = firstChoice.get("message");
            if (messageObj instanceof Map<?, ?> message) {
                Object contentObj = message.get("content");
                if (contentObj != null) {
                    return contentObj.toString();
                }
            }

            Object deltaObj = firstChoice.get("delta");
            if (deltaObj instanceof Map<?, ?> delta) {
                Object contentObj = delta.get("content");
                if (contentObj != null) {
                    return contentObj.toString();
                }
            }

            return "Brak tekstu odpowiedzi modelu (message.content).";
        } catch (HttpStatusCodeException e) {
            int status = e.getStatusCode().value();
            if (status == 401 || status == 403) {
                return "Hugging Face odrzucil autoryzacje (401/403). Sprawdz HUGGINGFACE_API_TOKEN.";
            }
            return "Blad Hugging Face HTTP " + status + ". Sprobuj ponownie pozniej.";
        } catch (ResourceAccessException e) {
            String msg = e.getMessage() == null ? "" : e.getMessage().toLowerCase();
            if (msg.contains("timed out") || msg.contains("timeout")) {
                return "Przekroczono limit czasu polaczenia z Hugging Face. Sprobuj ponownie.";
            }
            return "Brak polaczenia z Hugging Face. Sprawdz siec lub HUGGINGFACE_API_URL.";
        } catch (Exception e) {
            return "Wystapil blad podczas komunikacji z Hugging Face.";
        }
    }
}
