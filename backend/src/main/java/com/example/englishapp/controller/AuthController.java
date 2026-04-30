package com.example.englishapp.controller;

import com.example.englishapp.dto.LoginRequest;
import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor // To nam wstrzyknie repozytorium i encoder
// POPRAWKA PORTU: Masz 5173 na screenach, więc tu też musi być 5173
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final MyAppUserRepository myAppUserRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String loginInput = request.getUsername();

        // --- DIAGNOSTYKA START ---
        System.out.println("1. Próba logowania. Otrzymany tekst: '" + loginInput + "'");
        // --- DIAGNOSTYKA KONIEC ---

        Optional<MyAppUser> userOptional = myAppUserRepository.findByUsernameOrEmail(loginInput, loginInput);

        if (userOptional.isPresent()) {
            System.out.println("2. SUKCES: Znaleziono użytkownika w bazie: " + userOptional.get().getUsername());
            MyAppUser user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.ok(Map.of("message", "Zalogowano!", "username", user.getUsername()));
            } else {
                System.out.println("3. BŁĄD: Hasło się nie zgadza.");
            }
        } else {
            System.out.println("2. BŁĄD: Nie znaleziono takiego użytkownika w bazie ani po loginie, ani po emailu.");
        }

        return ResponseEntity.status(401).body(Map.of("error", "Złe dane logowania"));
    }
}