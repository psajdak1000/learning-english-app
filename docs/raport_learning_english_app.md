# Raport stanu projektu `learning-english-app` - backend, React i Kotlin

## 1. Cel raportu

Celem raportu jest podsumowanie aktualnego stanu projektu `learning-english-app` oraz wskazanie, co jest już zaimplementowane po ostatnich zmianach backendu i frontendu.

Projekt zakłada wspólne API dla dwóch klientów:

```text
- frontend web: React / Vite
- aplikacja mobilna: Kotlin / Jetpack Compose
```

Backend jest oparty o:

```text
- Java / Spring Boot
- PostgreSQL (docelowo) lub H2 (tryb demo)
- JWT
- Swagger / OpenAPI
```

---

## 2. Base URL

### Frontend React / przeglądarka

Frontend korzysta z centralnej konfiguracji API przez zmienną środowiskową:

```text
VITE_API_BASE_URL=http://localhost:19090
```

Jeśli backend działa na innym porcie, należy zmienić wartość `VITE_API_BASE_URL`.

Przykładowy adres frontendu lokalnie:

```text
http://127.0.0.1:5173
```

### Swagger backendu

Przykładowy adres Swagger UI:

```text
http://localhost:19090/swagger-ui/index.html
```

Jeśli backend uruchomiono na innym porcie, Swagger działa pod analogicznym adresem dla tego portu.

### Android Emulator

Dla aplikacji uruchomionej w Android Emulatorze należy używać:

```text
http://10.0.2.2:<PORT_BACKENDU>
```

### Fizyczny telefon

Dla aplikacji uruchomionej na fizycznym telefonie należy użyć adresu IP komputera w sieci lokalnej, np.:

```text
http://192.168.1.xxx:<PORT_BACKENDU>
```

---

## 3. Aktualny stan backendu

Backend Spring Boot posiada działające API dla modułów auth, użytkownika, bota AI oraz funkcji edukacyjnych.

Dostępne endpointy:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/users/me
POST /api/bot/ask

GET    /api/flashcards
GET    /api/flashcards/{id}
POST   /api/flashcards
PUT    /api/flashcards/{id}
DELETE /api/flashcards/{id}
GET    /api/flashcards?category=...&difficultyLevel=...

GET  /api/quizzes/start?count=...&direction=EN_TO_PL
GET  /api/quizzes/start?count=...&direction=PL_TO_EN
POST /api/quizzes/submit

GET  /api/progress
GET  /api/progress/{userId}
POST /api/progress/update

POST /api/results
GET  /api/results/history/{userId}
GET  /api/results/latest/{userId}
```

Backend ma już:

```text
- rejestrację użytkownika,
- logowanie użytkownika,
- JWT access token,
- endpoint aktualnego użytkownika,
- endpoint bota AI,
- moduł fiszek,
- moduł quizów,
- moduł postępu nauki,
- moduł historii wyników,
- wspólny format błędu ErrorResponse,
- Swagger / OpenAPI.
```

W module edukacyjnym zastosowano uproszczony tryb demonstracyjny z `demo-user`, gdy frontend nie ma pełnego powiązania modułów edukacyjnych z JWT.

---

## 4. Baza danych i model danych

Aktualny model danych backendu obejmuje encje:

```text
- MyAppUser (istniejący użytkownik aplikacji)
- Flashcard
- LearningProgress
- QuizResult
```

Dodano seed danych demonstracyjnych:

```text
- DemoDataSeeder
```

Seeder dodaje przykładowe fiszki przy pustej tabeli `flashcards`, co pozwala od razu uruchomić demo quizów i postępów.

---

## 5. Aktualny stan frontendu React

Frontend React istniał wcześniej i został rozbudowany (nie tworzony od zera).

Stan obecny:

```text
- działają ekrany logowania i rejestracji,
- istnieje centralny klient API,
- dodano integrację funkcji edukacyjnych z backendem,
- zachowano istniejący układ projektu (React + Vite + obecne style i routing).
```

Zintegrowane ekrany:

```text
- FlashcardsPage
- QuizPage
- ProgressPage
- ResultsPage
```

Szczegóły:

```text
- FlashcardsPage: lista fiszek z backendu, dodawanie, edycja, usuwanie, podstawowe filtrowanie.
- QuizPage: uruchomienie quizu (count + direction), wysyłka odpowiedzi, prezentacja wyniku.
- Po quizie: zapis wyniku do /api/results oraz aktualizacja postępu przez /api/progress/update.
- ProgressPage: odczyt statystyk nauki użytkownika.
- ResultsPage: ostatni wynik i historia wyników użytkownika.
```

---

## 6. Konfiguracja API po stronie frontendu

Frontend korzysta z centralnej konfiguracji API:

```text
frontend/src/api/apiClient.js
```

Źródło adresu backendu:

```text
import.meta.env.VITE_API_BASE_URL
```

Przykład pliku `.env`:

```text
VITE_API_BASE_URL=http://localhost:19090
```

Dzięki temu adres backendu nie jest wpisany na sztywno w wielu miejscach.

---

## 7. Wspólny format błędu `ErrorResponse`

Backend zwraca błędy w jednym formacie. React i Kotlin powinny czytać głównie pole `message`.

Przykład:

```json
{
  "message": "Unauthorized",
  "status": 401,
  "timestamp": "2026-05-04T20:00:00",
  "path": "/api/auth/login",
  "fieldErrors": null
}
```

Dla błędów walidacji `fieldErrors` może zawierać szczegóły pól.

---

## 8. Endpointy gotowe do użycia przez Kotlin

Po ostatnich zmianach backendu Kotlin może korzystać z endpointów:

```text
- auth: /api/auth/register, /api/auth/login
- user: /api/users/me
- bot: /api/bot/ask
- flashcards: /api/flashcards (...)
- quizzes: /api/quizzes/start, /api/quizzes/submit
- progress: /api/progress, /api/progress/{userId}, /api/progress/update
- results: /api/results, /api/results/history/{userId}, /api/results/latest/{userId}
```

Uwaga implementacyjna:

```text
W module edukacyjnym można używać `demo-user` jako użytkownika demonstracyjnego,
jeśli aplikacja mobilna nie ma jeszcze pełnej integracji modułów edukacyjnych z JWT.
```

---

## 9. Uruchamianie projektu (aktualne)

### Backend - tryb demo H2

```powershell
cd backend
mvn spring-boot:run "-Dspring-boot.run.arguments=--server.port=19090 --spring.datasource.url=jdbc:h2:mem:demo-db;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE --spring.datasource.driver-class-name=org.h2.Driver --spring.datasource.username=sa --spring.datasource.password= --spring.jpa.database-platform=org.hibernate.dialect.H2Dialect --spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect --spring.jpa.hibernate.ddl-auto=create-drop --huggingface.api-token=test-token"
```

### Frontend

```powershell
cd frontend
npm install
'VITE_API_BASE_URL=http://localhost:19090' | Set-Content .env
npm run dev
```

Adres aplikacji:

```text
http://127.0.0.1:5173
```

---

## 10. Weryfikacja buildów i uruchomienia

Wykonana weryfikacja:

```text
- backend: mvn -DskipTests compile -> OK,
- backend: mvn test -> OK (brak istotnych testów automatycznych),
- frontend: npm run build -> OK,
- frontend: npm run dev -> OK,
- Swagger działał lokalnie,
- nowe endpointy były widoczne w Swaggerze.
```

---

## 11. Aktualna architektura modułów edukacyjnych

Moduły edukacyjne działają w prostym wariancie demonstracyjnym:

```text
- fiszki: pełny CRUD,
- quiz: start + submit + wynik procentowy,
- postęp: odczyt i aktualizacja statystyk,
- wyniki: zapis, ostatni wynik, historia.
```

Sprawdzanie odpowiedzi quizowych jest celowo proste:

```text
- trim,
- case-insensitive.
```

---

## 12. Uzgodnienia między React, Kotlin i backendem

Najważniejsza zasada pozostaje bez zmian:

```text
React i Kotlin korzystają z jednego wspólnego API.
```

Wspólne ustalenia:

```text
- jeden kontrakt API,
- jeden format ErrorResponse,
- te same nazwy pól JSON,
- token w nagłówku Authorization: Bearer <accessToken>,
- brak refresh tokena,
- brak backendowego logoutu.
```

---

## 13. Najbliższe zadania backend/frontend

Rekomendowane dalsze kroki:

```text
1. Podpiąć /api/users/me i /api/bot/ask do pełnego flow frontendu.
2. Dodać pełny logout i ochronę tras.
3. Powiązać moduły edukacyjne z realnym userId z JWT (zamiast demo-user).
4. Dodać walidacje UI na poziomie formularzy fiszek i quizu.
5. Rozszerzyć statystyki i raportowanie wyników.
```

---

## 14. Najbliższe zadania mobile (Kotlin)

Po stronie Kotlin można teraz równolegle realizować:

```text
1. Integrację auth i user.
2. Integrację fiszek (CRUD/lista).
3. Integrację quizu (start/submit).
4. Integrację postępu i historii wyników.
5. Obsługę 401 i lokalnego logoutu.
```

---

## 15. Ograniczenia i możliwe dalsze prace

Aktualne ograniczenia projektu:

```text
- uproszczony demo-user w modułach edukacyjnych,
- brak pełnego powiązania modułów edukacyjnych z JWT,
- proste sprawdzanie odpowiedzi quizowych (trim + case-insensitive),
- brak paginacji,
- brak zaawansowanych statystyk,
- brak pełnych testów integracyjnych,
- tryb H2 przeznaczony głównie do demonstracji,
- brak migracji bazy w stylu Flyway/Liquibase.
```

Docelowo warto dodać:

```text
- pełne mapowanie userId z JWT,
- migracje Flyway/Liquibase,
- testy integracyjne API,
- bardziej zaawansowane statystyki i filtrowanie.
```

---

## 16. Podsumowanie ostatnich zmian

Po ostatniej serii zmian projekt przeszedł z etapu „planowane funkcje edukacyjne” do działającej wersji demonstracyjnej:

```text
- backend ma zaimplementowane moduły: fiszki, quizy, postęp nauki, historia wyników,
- frontend został rozbudowany i podłączony do nowych endpointów,
- działają ekrany: FlashcardsPage, QuizPage, ProgressPage, ResultsPage,
- po quizie zapisywany jest wynik i aktualizowany postęp,
- API jest konfigurowane centralnie przez VITE_API_BASE_URL,
- całość uruchamia się lokalnie i nadaje się do prezentacji demo.
```

