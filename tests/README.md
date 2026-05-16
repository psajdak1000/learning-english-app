# Testy - English Learning App

Folder `tests/` zawiera kompletny zestaw testów dla aplikacji, podzielony na cztery kategorie:

## Struktura

```
tests/
├── backend/                        # Testy backendowe (Java, Maven)
│   ├── pom.xml                     # Osobny POM z zależnościami testowymi
│   └── src/test/java/com/example/englishapp/
│       ├── unit/                   # Testy jednostkowe
│       │   ├── JwtServiceTest.java
│       │   ├── MyAppUserServiceTest.java
│       │   └── HuggingFaceServiceTest.java
│       ├── integration/            # Testy integracyjne (Spring Boot + H2)
│       │   ├── AuthIntegrationTest.java
│       │   └── RegistrationIntegrationTest.java
│       └── endpoint/               # Testy endpointów (MockMvc)
│           ├── AuthEndpointTest.java
│           ├── BotEndpointTest.java
│           └── UserEndpointTest.java
│
├── frontend/                       # Testy frontendowe (Vitest + RTL)
│   ├── package.json
│   ├── vitest.config.js
│   └── src/
│       ├── unit/                   # Testy jednostkowe
│       │   ├── useTheme.test.js
│       │   └── passwordStrength.test.js
│       └── integration/            # Testy integracyjne komponentów
│           ├── LoginPage.test.jsx
│           ├── RegisterPage.test.jsx
│           └── App.test.jsx
│
└── e2e/                            # Testy end-to-end (Playwright)
    ├── package.json
    ├── playwright.config.js
    └── tests/
        ├── home.spec.js
        ├── login.spec.js
        ├── register.spec.js
        └── navigation.spec.js
```

## Uruchamianie testów

### Backend (unit + integration + endpoint)
```bash
cd tests/backend
mvn test
```

### Frontend (unit + integration)
```bash
cd tests/frontend
npm install
npm test
```

### E2E
```bash
cd tests/e2e
npm install
npx playwright install
npx playwright test
```
Wymaga uruchomionego frontendu (`npm run dev` w folderze `frontend/`).
