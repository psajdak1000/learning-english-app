package com.example.englishapp.controller;



import com.example.englishapp.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // To klucz! Mówi: "Będę zwracać dane (JSON), a nie widoki HTML"
@RequestMapping("/api/auth")
// WAŻNE: To pozwala Reactowi (port 5174) gadać z Backendem (port 8080). Bez tego przeglądarka zablokuje zapytanie.
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // @RequestBody bierze JSON z Reacta i zamienia go na obiekt Java

        System.out.println("Próba logowania: " + request.getUsername());

        // PROSTA SYMULACJA LOGIKI (później podepniesz tu bazę danych)
        if ("admin".equals(request.getUsername()) && "haslo123".equals(request.getPassword())) {
            // Sukces - zwracamy JSON: {"message": "Zalogowano", "status": "OK"}
            return ResponseEntity.ok(Map.of("message", "Zalogowano pomyślnie", "token", "fake-jwt-token"));
        } else {
            // Błąd - zwracamy kod 401 (Unauthorized)
            return ResponseEntity.status(401).body(Map.of("error", "Złe hasło lub login"));
        }
    }
}
