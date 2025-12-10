import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import StartingPage from './components/StartingPage';
import FlashcardsView from './components/FlashcardsView';

function App() {
    const [showStartAnimation, setShowStartAnimation] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // możesz tu dać 2200 albo 3000 ms – jak wolisz
        const timer = setTimeout(() => setShowStartAnimation(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    // --- Nawigacja przez router ---

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/signup');
    };

    const handleFlashcardsClick = () => {
        navigate('/flashcards');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // --- Logowanie do backendu ---

    const handleLogin = async (credentials) => {
        console.log('Próba logowania z danymi:', credentials);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Sukces! Odpowiedź serwera:', data);

                // np. zapis tokena
                // localStorage.setItem('token', data.token);

                alert('Zalogowano pomyślnie!');
                navigate('/flashcards'); // albo '/', jak wolisz
            } else {
                alert('Nieprawidłowy login lub hasło.');
            }
        } catch (error) {
            console.error('Błąd połączenia:', error);
            alert('Błąd połączenia z serwerem. Czy Spring Boot jest włączony?');
        }
    };

    const handleRegister = (credentials) => {
        console.log('Rejestracja (do zrobienia w backendzie):', credentials);
        alert('Funkcja rejestracji jeszcze niepodpięta pod backend.');
    };

    return (
        <>
            {/* ANIMACJA STARTOWA – możesz wziąć swoją ulubioną wersję */}
            <AnimatePresence>
                {showStartAnimation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.65 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#181818',
                            zIndex: 9999,
                        }}
                    >
                        <div style={{ textAlign: 'center', color: '#fafafa' }}>
                            <motion.h1
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: [1, 1.13, 1], opacity: [0, 1, 0.98, 1] }}
                                transition={{ duration: 0.9, delay: 0.2 }}
                                style={{
                                    fontSize: '3.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1.1rem',
                                    letterSpacing: '0.08em',
                                    textShadow: '0 3px 14px #000',
                                }}
                            >
                                English Master
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5 }}
                                style={{
                                    fontSize: '1.33rem',
                                    color: '#d32f2f',
                                    marginBottom: '2rem',
                                    textShadow: '0 2px 8px #600',
                                }}
                            >
                                Ucz się angielskiego w nowoczesnym stylu
                            </motion.p>
                            <motion.div
                                animate={{
                                    scale: [1, 1.29, 1],
                                    rotate: [0, -12, 12, 0],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                style={{
                                    marginTop: '2.5rem',
                                    fontSize: '4rem',
                                    filter: 'drop-shadow(0 0 12px #d32f2f88)',
                                }}
                            >
                                🔥
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Główne widoki zarządzane przez router */}
            {!showStartAnimation && (
                <Routes>
                    {/* Strona startowa z trzema przyciskami */}
                    <Route
                        path="/"
                        element={
                            <StartingPage
                                onLoginClick={handleLoginClick}
                                onRegisterClick={handleRegisterClick}
                                onFlashcardsClick={handleFlashcardsClick}
                            />
                        }
                    />

                    {/* Logowanie */}
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

                    {/* Rejestracja */}
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

                    {/* Fiszki */}
                    <Route
                        path="/flashcards"
                        element={<FlashcardsView onBack={handleBackToHome} />}
                    />
                </Routes>
            )}
        </>
    );
}

export default App;
