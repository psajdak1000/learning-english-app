# Backend setup

## 1. Wymagania lokalne
- Java 17
- Maven 3.x
- PostgreSQL (uruchomiona baza zgodna z konfiguracja w application.yml)
- Dzialajaca baza danych: jdbc:postgresql://localhost:5432/registration
- Opcjonalnie: prawdziwy token Hugging Face do testowania /api/bot/ask

## 2. Uruchomienie backendu lokalnie
1. Wejdz do katalogu backend
2. Ustaw zmienna srodowiskowa HUGGINGFACE_API_TOKEN
3. Uruchom aplikacje przez Maven

Przyklad (PowerShell):
```
cd backend
$env:HUGGINGFACE_API_TOKEN="test-token"
mvn spring-boot:run
```

Uwagi:
- test-token pozwala uruchomic backend, ale /api/bot/ask moze zwrocic blad 401 z zewnetrznego API Hugging Face,
- do rzeczywistego dzialania bota potrzebny jest prawdziwy token Hugging Face,
- prawdziwych tokenow nie nalezy commitowac do repozytorium.

## 3. Konfiguracja JWT
- accessToken jest zwracany przez POST /api/auth/login
- token wysyla sie jako: Authorization: Bearer <accessToken>
- ustawienia w application.yml:
  - jwt.secret (sekret dla podpisu tokenu, w dev mozna uzyc placeholdera)
  - jwt.expirationSeconds (czas waznosci w sekundach)

## 4. Adresy developerskie
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs
- Emulator Androida: http://10.0.2.2:8080

## 5. Podstawowe endpointy
- POST /api/auth/register — publiczny
- POST /api/auth/login — publiczny
- GET /api/users/me — wymaga JWT
- POST /api/bot/ask — wymaga JWT

## 6. Reczne testowanie (PowerShell)
### Rejestracja
```
$body = @{ username = "janek"; email = "janek@example.com"; password = "tajnehaslo" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/register" -ContentType "application/json" -Body $body
```

### Logowanie i zapis tokena
```
$body = @{ username = "janek"; password = "tajnehaslo" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/login" -ContentType "application/json" -Body $body
$token = $login.accessToken
```

### GET /api/users/me z Authorization
```
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/users/me" -Headers @{ Authorization = "Bearer $token" }
```

### POST /api/bot/ask bez tokena (oczekiwane 401)
```
$body = @{ question = "Hello" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/bot/ask" -ContentType "application/json" -Body $body
```

### POST /api/bot/ask z tokenem
```
$body = @{ question = "Hello" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/bot/ask" -ContentType "application/json" -Body $body -Headers @{ Authorization = "Bearer $token" }
```

Uwaga: przy test-token odpowiedz z /api/bot/ask moze byc bledem z zewnetrznego API Hugging Face, ale JWT powinien przejsc.

## 7. Pliki, ktorych nie nalezy commitowac
- backend/target/
- node_modules/
- .env
- prawdziwe tokeny i sekrety
- lokalne pliki IDE (jesli nie sa celowo wersjonowane)

## 8. Kontrola git przed commitem
- uzyj: git status
- sprawdz, czy w commicie sa tylko celowe pliki
- nie uzywaj bezmyslnie: git add .
- przy dokumentacji dodaj konkretny plik, np. git add docs/backend-setup.md

## 9. Rekomendacje do .gitignore
Jesli brakuje wpisow, rozważ dodanie (nie zmieniaj automatycznie):
- backend/target/
- node_modules/
- .env
- *.log
- .idea/
- .vscode/

## 10. Powiazane dokumenty
- docs/api-contract.md — wspolny kontrakt API dla React i Kotlin

## 11. Co jeszcze nie jest gotowe
- brak refresh tokena
- brak logout endpointu
- brak wersjonowania /api/v1
- brak historii rozmow z botem
- brak rate limiting dla AI
- brak produkcyjnej konfiguracji sekretow
- brak testow automatycznych kontraktu API
