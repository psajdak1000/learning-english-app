package com.example.englishapp.config;

import com.example.englishapp.model.Flashcard;
import com.example.englishapp.model.FlashcardRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

    private final FlashcardRepository flashcardRepository;

    @Override
    public void run(String... args) {
        if (flashcardRepository.count() > 0) {
            return;
        }

        List<Flashcard> flashcards = List.of(
                new Flashcard(null, "apple", "jablko", "I eat an apple every morning.", "A1", "Food"),
                new Flashcard(null, "book", "ksiazka", "This book is very interesting.", "A1", "Education"),
                new Flashcard(null, "travel", "podrozowac", "We travel by train every summer.", "A2", "Travel"),
                new Flashcard(null, "improve", "ulepszac", "I want to improve my English.", "A2", "Learning"),
                new Flashcard(null, "deadline", "termin", "The project deadline is next Monday.", "B1", "Work"),
                new Flashcard(null, "challenge", "wyzwanie", "Learning pronunciation is a challenge.", "B1", "Learning"),
                new Flashcard(null, "achievement", "osiagniecie", "Getting this certificate was a big achievement.", "B2", "Motivation"),
                new Flashcard(null, "schedule", "harmonogram", "I updated my study schedule yesterday.", "B1", "Work"),
                new Flashcard(null, "confident", "pewny siebie", "She feels confident when she speaks English.", "B1", "Emotions"),
                new Flashcard(null, "environment", "srodowisko", "We should protect the environment.", "B2", "Nature")
        );

        flashcardRepository.saveAll(flashcards);
    }
}
