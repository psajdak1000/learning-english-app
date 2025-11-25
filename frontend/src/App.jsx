import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Importujemy hooki z routera do nawigacji
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import StartingPage from './components/StartingPage';

function App() {
  const [showStartAnimation, setShowStartAnimation] = useState(true);

  // Hook pozwalający zmieniać strony (URL) z poziomu kodu JS
  const navigate = useNavigate();

  useEffect(() => {
    // Animacja startowa trwa 3 sekundy
    const timer = setTimeout(() => setShowStartAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- NAWIGACJA (Zmienia URL zamiast stanów lokalnych) ---

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/signup');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // --- KOMUNIKACJA Z BACKENDEM (Spring Boot) ---

  const handleLogin = async (credentials) => {
    console.log('Próba logowania z danymi:', credentials);

    try {
      // Wysyłamy zapytanie POST na adres Twojego backendu
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Zamieniamy obiekt JS {username: "...", password: "..."} na tekst JSON
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        // Jeśli Spring zwróci status 200 OK
        const data = await response.json();
        console.log('Sukces! Odpowiedź serwera:', data);

        alert("Zalogowano pomyślnie! (Sprawdź konsolę)");
        // Tutaj możesz zapisać token, np.: localStorage.setItem('token', data.token);

        // Przekierowanie na stronę główną po sukcesie
        navigate('/');
      } else {
        // Jeśli Spring zwróci błąd (np. 401 Unauthorized)
        console.log('Błąd logowania');
        alert("Nieprawidłowy login lub hasło.");
      }
    } catch (error) {
      // Jeśli serwer nie odpowiada (np. Spring jest wyłączony)
      console.error('Błąd połączenia:', error);
      alert("Błąd połączenia z serwerem. Czy Spring Boot jest włączony?");
    }
  };

  const handleRegister = (credentials) => {
    console.log('Rejestracja (Logika do zrobienia):', credentials);
    // Tutaj w przyszłości dodasz analogiczny fetch na endpoint /register
    alert("Funkcja rejestracji jeszcze nie podpięta pod backend.");
  };

  return (
      <>
        {/* --- ANIMACJA STARTOWA (bez zmian) --- */}
        <AnimatePresence>
          {showStartAnimation && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    zIndex: 9999
                  }}
              >
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <motion.h1
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                  >
                    English Master
                  </motion.h1>
                  <motion.p
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      style={{ fontSize: '1.4rem', opacity: 0.9 }}
                  >
                    Ucz się angielskiego w nowoczesny sposób
                  </motion.p>
                  <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ marginTop: '2rem', fontSize: '4rem' }}
                  >
                    📚
                  </motion.div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* --- WIDOKI GŁÓWNE (Zarządzane przez Router) --- */}
        {!showStartAnimation && (
            <Routes>
              {/* Strona Startowa */}
              <Route
                  path="/"
                  element={<StartingPage onLoginClick={handleLoginClick} />}
              />

              {/* Strona Logowania */}
              <Route
                  path="/login"
                  element={
                    <Login
                        onLogin={handleLogin}
                        onBackToHome={handleBackToHome}
                        onRegisterClick={handleRegisterClick}
                    />
                  }
              />

              {/* Strona Rejestracji */}
              <Route
                  path="/signup"
                  element={
                    <Register
                        onRegister={handleRegister}
                        onBackToHome={handleBackToHome}
                        onBackToLogin={handleLoginClick}
                    />
                  }
              />
            </Routes>
        )}
      </>
  );
}

export default App;