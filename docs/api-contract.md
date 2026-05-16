# API Contract — English App

## 1. Cel dokumentu
Ten dokument opisuje wspolne API backendu dla dwoch klientow:
- frontend webowy React,
- aplikacja mobilna Kotlin Jetpack Compose.

Oba klienty korzystaja z tych samych endpointow, tych samych JSON-ow i tego samego mechanizmu JWT.

## 2. Base URL
Lokalnie dla przegladarki i Reacta:

http://localhost:8080

Dla emulatora Androida:

http://10.0.2.2:8080

Uwaga:
- React uruchomiony lokalnie moze korzystac z localhost:8080,
- emulator Androida zwykle nie uzywa localhost do hosta komputera, tylko 10.0.2.2.

## 3. Wspolny flow autoryzacji
1. Rejestracja uzytkownika.
2. Logowanie uzytkownika.
3. Backend zwraca accessToken.
4. Klient zapisuje accessToken.
5. Klient wysyla token w naglowku:
   Authorization: Bearer <accessToken>
6. Klient pobiera aktualnego uzytkownika przez /api/users/me.
7. Klient wysyla zapytania do /api/bot/ask z tokenem.

Rozroznienie klientow:
- React: token mozna przechowywac tymczasowo w localStorage/sessionStorage (etap developerski).
- Kotlin: token mozna przechowywac w DataStore lub innym bezpieczniejszym mechanizmie.

## 4. Endpointy publiczne

### POST /api/auth/register
Opis: rejestracja nowego uzytkownika. Publiczny endpoint.

Request JSON:
```json
{
  "username": "janek",
  "email": "janek@example.com",
  "password": "tajnehaslo"
}
```

Response 201 JSON:
```json
{
  "id": 2,
  "username": "janek",
  "email": "janek@example.com"
}
```

Bledy:
- 400 Bad Request
- 409 Conflict

Uwaga: response nie zawiera password ani hash hasla.

### POST /api/auth/login
Opis: logowanie uzytkownika i zwrocenie JWT access token. Publiczny endpoint.

Request JSON:
```json
{
  "username": "janek",
  "password": "tajnehaslo"
}
```

Response 200 JSON:
```json
{
  "message": "Zalogowano!",
  "tokenType": "Bearer",
  "username": "janek",
  "accessToken": "eyJ...",
  "user": {
    "id": 2,
    "username": "janek",
    "email": "janek@example.com"
  }
}
```

Bledy:
- 400 Bad Request
- 401 Unauthorized

Uwaga: tokenType ma wartosc Bearer.

## 5. Endpointy chronione JWT
Wymagany naglowek:

Authorization: Bearer <accessToken>

### GET /api/users/me
Opis: pobranie danych aktualnie zalogowanego uzytkownika.

Response 200 JSON:
```json
{
  "id": 2,
  "username": "janek",
  "email": "janek@example.com"
}
```

Bledy:
- 401 Unauthorized
- 404 Not Found (gdy uzytkownik nie istnieje)

### POST /api/bot/ask
Opis: wyslanie pytania do bota AI.

Request JSON:
```json
{
  "question": "Hello"
}
```

Response 200 JSON:
```json
{
  "answer": "..."
}
```

Bledy:
- 400 Bad Request
- 401 Unauthorized

Uwaga: przy lokalnym HUGGINGFACE_API_TOKEN="test-token" moze pojawic sie blad zewnetrznego API Hugging Face, ale nie oznacza to bledu JWT.

## 6. Format bledow
Wspolny format ErrorResponse:
```json
{
  "message": "Unauthorized",
  "status": 401,
  "timestamp": "2026-05-02T14:17:56.395032900Z",
  "path": "/api/bot/ask",
  "fieldErrors": null
}
```

Pola:
- message: opis bledu
- status: kod HTTP
- timestamp: czas w ISO-8601
- path: sciezka zadania
- fieldErrors: mapa bledow walidacji lub null

Przyklady bledow:
- 400 Validation failed
- 401 Unauthorized
- 409 Username already exists
- 409 Email already exists

## 7. Modele JSON wspolne dla React i Kotlin
Pola i typy logiczne (JSON / JavaScript / Kotlin):

- RegisterRequest
  - username: string / String
  - email: string / String
  - password: string / String

- LoginRequest
  - username: string / String
  - password: string / String

- UserResponse
  - id: number / Long
  - username: string / String
  - email: string / String

- LoginResponse (model kliencki wynikajacy z aktualnego JSON-a)
  - message: string / String
  - tokenType: string / String
  - username: string / String
  - accessToken: string / String
  - user: UserResponse

- ChatRequest
  - question: string / String

- ChatResponse (model kliencki wynikajacy z aktualnego JSON-a)
  - answer: string / String

- ErrorResponse
  - message: string / String
  - status: number / Int
  - timestamp: string / String
  - path: string / String
  - fieldErrors: object/map lub null

## 8. Przykladowe typy TypeScript dla Reacta
```ts
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
};

export type LoginResponse = {
  message: string;
  tokenType: "Bearer" | string;
  username: string;
  accessToken: string;
  user: UserResponse;
};

export type ChatRequest = {
  question: string;
};

export type ChatResponse = {
  answer: string;
};

export type ErrorResponse = {
  message: string;
  status: number;
  timestamp: string;
  path: string;
  fieldErrors: Record<string, string> | null;
};
```

## 9. Przykladowe Kotlin data class dla mobile
```kotlin
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String
)

data class LoginRequest(
    val username: String,
    val password: String
)

data class UserResponse(
    val id: Long,
    val username: String,
    val email: String
)

// Model kliencki wynikajacy z aktualnego JSON-a
// (nie istnieje jako osobny DTO w backendzie)
data class LoginResponse(
    val message: String,
    val tokenType: String,
    val username: String,
    val accessToken: String,
    val user: UserResponse
)

data class ChatRequest(
    val question: String
)

// Model kliencki wynikajacy z aktualnego JSON-a
// (nie istnieje jako osobny DTO w backendzie)
data class ChatResponse(
    val answer: String
)

data class ErrorResponse(
    val message: String,
    val status: Int,
    val timestamp: String,
    val path: String,
    val fieldErrors: Map<String, String>?
)
```

## 10. Przykladowy klient API dla Reacta
```ts
// register
await fetch("http://localhost:8080/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, email, password })
});

// login
const loginResp = await fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password })
});
const loginData = await loginResp.json();
const token = loginData.accessToken;

// getCurrentUser
await fetch("http://localhost:8080/api/users/me", {
  headers: { "Authorization": `Bearer ${token}` }
});

// askBot
await fetch("http://localhost:8080/api/bot/ask", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ question: "Hello" })
});
```

## 11. Przykladowy Retrofit API interface dla Kotlin
```kotlin
interface ApiService {
    @POST("/api/auth/register")
    suspend fun register(@Body request: RegisterRequest): UserResponse

    @POST("/api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("/api/users/me")
    suspend fun getCurrentUser(@Header("Authorization") auth: String): UserResponse

    @POST("/api/bot/ask")
    suspend fun askBot(
        @Header("Authorization") auth: String,
        @Body request: ChatRequest
    ): ChatResponse
}
```

## 12. Obsluga tokena po stronie klientow
React:
- token mozna zapisac tymczasowo w localStorage/sessionStorage na etapie developerskim,
- do chronionych endpointow trzeba wysylac Authorization: Bearer <token>,
- po 401 klient powinien przekierowac uzytkownika do logowania.

Kotlin:
- token mozna zapisac w DataStore albo bezpieczniejszym mechanizmie,
- do chronionych endpointow trzeba wysylac Authorization: Bearer <token>,
- po 401 aplikacja powinna wyczyscic token i pokazac ekran logowania.

Wazne:
- refresh token nie istnieje jeszcze,
- po wygasnieciu accessToken uzytkownik musi zalogowac sie ponownie.

## 13. Swagger/OpenAPI
- Swagger UI dziala pod adresem:
  http://localhost:8080/swagger-ui/index.html
- Dokumentacja OpenAPI JSON dziala pod:
  http://localhost:8080/v3/api-docs
- Swagger ma przycisk Authorize dla JWT Bearer.
- /api/users/me i /api/bot/ask sa oznaczone jako chronione.
- /api/auth/login i /api/auth/register sa publiczne.

## 14. Co jeszcze nie jest gotowe
- brak refresh tokena,
- brak logout endpointu,
- brak wersjonowania /api/v1,
- brak historii rozmow z botem,
- brak rate limiting dla AI,
- brak produkcyjnej konfiguracji sekretow,
- brak testow automatycznych kontraktu API,
- brak gotowego klienta API po stronie React i Kotlin.

## 15. Nastepne rekomendowane kroki
1. Dodac testy backendu dla auth, JWT i /api/users/me.
2. Przygotowac klienta API dla Reacta na bazie tego kontraktu.
3. Przygotowac klienta API dla Kotlin/Retrofit na bazie tego kontraktu.
4. Dodac ekran logowania i rejestracji w nowym frontendzie.
5. Dodac obsluge tokena po stronie klientow.
6. Dodac ekran rozmowy z botem.
7. Dopiero pozniej rozwazyc refresh token i logout.
