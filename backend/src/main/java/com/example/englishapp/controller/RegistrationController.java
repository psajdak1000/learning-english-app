package com.example.englishapp.controller;

import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // 1. Dodajemy wspólny prefiks dla endpointów związanych z autoryzacją
@CrossOrigin(origins = "http://localhost:5173") // 2. Ustawiamy CORS dla frontendu (5173 to port Vite)
@AllArgsConstructor
public class RegistrationController {

    private final MyAppUserRepository myAppUserRepository;
    private final PasswordEncoder passwordEncoder;

    // Teraz adres to: POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public MyAppUser createUser(@RequestBody MyAppUser user) {

        // 1. Szyfrujemy hasło (to już masz i jest OK)
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 2. NAPRAWA NULLA: Jeśli username jest pusty, przypisz mu wartość z emaila
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            user.setUsername(user.getEmail());
        }

        // 3. Zapisujemy kompletnego użytkownika
        return myAppUserRepository.save(user);
    }
}