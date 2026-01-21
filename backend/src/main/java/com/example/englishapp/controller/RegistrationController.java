package com.example.englishapp.controller;

import com.example.englishapp.model.MyAppUser;
import com.example.englishapp.model.MyAppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor // 1. To automatycznie tworzy konstruktor dla pól poniżej (wstrzykiwanie)
public class RegistrationController {

    private final MyAppUserRepository myAppUserRepository; // 2. Deklarujemy repozytorium
    private final PasswordEncoder passwordEncoder;         // 3. Deklarujemy koder haseł

    @PostMapping(value = "/req/signup", consumes = "application/json")
    public MyAppUser createUser(@RequestBody MyAppUser user) {

        // 4. Szyfrujemy hasło przed zapisem do bazy!
        // Bez tego nie będziesz mógł się potem zalogować.
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 5. Używamy standardowej metody .save()
        return myAppUserRepository.save(user);
    }
}