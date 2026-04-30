import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import StartingPage from './components/StartingPage';
import FlashcardsView from './components/FlashcardsView';
import ChatBot from './components/ChatBot'; // <--- 1. NOWY IMPORT

function App() {
    const [showStartAnimation, setShowStartAnimation] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setUser({ username, token });
        }
    }, []);

    useEffect(() => {
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

    // <--- 2. NOWA FUNKCJA DO NAWIGACJI
    const handleChatClick = () => {
        navigate('/chat');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // --- Logowanie do backendu ---
// W pliku App.jsx

// Parametr nazywamy 'userData', bo to jest wynik logowania, a nie dane do logowania
    const handleLogin = (userData) => {
        // Krytyczne logi dla Ciebie, żebyś widział co przyszło
        console.log('App.jsx: Otrzymano potwierdzenie logowania z Login.jsx');
        console.log('App.jsx: Dane użytkownika:', userData);

        // Weryfikacja "Sanity check" - czy na pewno dostaliśmy dane?
        if (!userData || !userData.username) {
            console.error("Błąd krytyczny: Login.jsx zgłosił sukces, ale nie przekazał danych!");
            alert("Błąd logowania: Brak danych użytkownika.");
            return;
        }

        // 1. Aktualizacja stanu aplikacji
        setUser(userData);
        localStorage.setItem('username', userData.username);

        // 2. Przekierowanie
        alert(`Witaj ponownie, ${userData.username}!`);
        navigate('/');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert("Wylogowano pomyślnie.");
        navigate('/');
    };

    const handleRegister = async (credentials) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (response.ok) {
                alert('Konto założone! Teraz możesz się zalogować.');
                navigate('/login');
            } else {
                alert('Błąd rejestracji. Spróbuj innej nazwy użytkownika.');
            }
        } catch (error) {
            console.error(error);
            alert('Błąd połączenia z serwerem.');
        }
    };

    return (
        <>
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

            {!showStartAnimation && (
                <Routes>
                    <Route
                        path="/"
                        element={
                            <StartingPage
                                onLoginClick={handleLoginClick}
                                onRegisterClick={handleRegisterClick}
                                onFlashcardsClick={handleFlashcardsClick}
                                onChatClick={handleChatClick}
                                user={user}
                                onLogout={handleLogout}
                            />
                        }
                    />

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

                    <Route
                        path="/flashcards"
                        element={<FlashcardsView onBack={handleBackToHome} />}
                    />

                    {/* <--- 4. NOWA TRASA DLA CZATU */}
                    <Route
                        path="/chat"
                        element={<ChatBot />}
                    />
                </Routes>
            )}
        </>
    );
}

export default App;