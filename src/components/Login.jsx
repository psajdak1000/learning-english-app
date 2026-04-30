import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onBackToHome, onRegisterClick }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Dodajemy 'async', żeby obsłużyć połączenie sieciowe
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Szybka walidacja w przeglądarce
        if (!username || !password) {
            setError('Wszystkie pola są wymagane!');
            return;
        }
        setError('');

        // 2. ŁĄCZENIE Z BACKENDEM
        try {
            // Upewnij się, że ten adres pasuje do Twojego kontrolera w Springu (np. AuthController)
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username, // Upewnij się, że backend oczekuje pola 'username' (a nie 'email'!)
                    password: password
                }),
            });

            if (response.ok) {
                // SUKCES (Kod 200)
                // Często backend zwraca tutaj token (JWT) lub dane użytkownika
                const data = await response.json();

                // Opcjonalnie: Zapisz token w przeglądarce, jeśli używasz JWT
                // localStorage.setItem('token', data.token);

                alert("Zalogowano pomyślnie!");

                // Wywołujemy funkcję z App.jsx, żeby zmienić ekran na główny
                if (onLogin) {
                    onLogin(data);
                }
            } else {
                // BŁĄD Logowania (np. kod 401 - złe hasło)
                setError("Nieprawidłowy login lub hasło.");
            }
        } catch (err) {
            // BŁĄD POŁĄCZENIA (np. wyłączony serwer)
            console.error(err);
            setError("Błąd połączenia z serwerem.");
        }
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        onRegisterClick && onRegisterClick();
    };

    return (
        <div className="login-bg">
            {onBackToHome && (
                <button className="back-btn" onClick={onBackToHome}>
                    ← Powrót do strony głównej
                </button>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Logowanie</h2>

                <div className="login-field">
                    <label htmlFor="username">Login</label>
                    <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="Podaj login (np. admin)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Podaj hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <div className="login-error">{error}</div>}

                <button className="login-btn" type="submit">
                    Zaloguj się
                </button>

                <div className="login-help">
                    Nie masz konta?{' '}
                    <a href="#" onClick={handleRegisterClick}>
                        Załóż konto
                    </a>
                </div>
            </form>
        </div>
    );
}