import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onBackToHome, onRegisterClick }) {
    // Logowanie po nazwie użytkownika (username), zgodnie z LoginRequest w backendzie
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Wszystkie pola są wymagane!');
            return;
        }

        setError('');

        // Wysyłamy username + password, tak jak oczekuje backend
        onLogin && onLogin({ username, password });
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
