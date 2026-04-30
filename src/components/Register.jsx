import { useState } from 'react';
import './Register.css';

export default function Register({ onBackToHome, onBackToLogin }) {
    // Trzy kluczowe stany dla formularza
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Opcjonalnie: powtórz hasło (dla bezpieczeństwa użytkownika)
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Walidacja: Czy wszystko jest wypełnione?
        if (!username || !email || !password || !confirm) {
            setError('Wszystkie pola (Login, Email, Hasło) są wymagane!');
            return;
        }

        // 2. Walidacja: Czy hasła są takie same?
        if (password !== confirm) {
            setError('Hasła muszą się zgadzać!');
            return;
        }

        setError('');

        // 3. WYSYŁKA DO SPRING BOOT
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,  // <-- To pole jest KLUCZOWE, żeby nie było NULL w bazie
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                alert("Rejestracja udana! Możesz się teraz zalogować.");
                if (onBackToLogin) {
                    onBackToLogin();
                }
            } else {
                // Obsługa błędu (np. taki email już istnieje)
                setError("Rejestracja nieudana. Sprawdź dane lub spróbuj innego loginu/emaila.");
            }

        } catch (err) {
            console.error(err);
            setError("Błąd połączenia z serwerem.");
        }
    };

    return (
        <div className="register-bg">
            {onBackToHome && (
                <button className="back-btn" onClick={onBackToHome}>
                    ← Powrót do strony głównej
                </button>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Rejestracja</h2>

                {/* --- POLE 1: NAZWA UŻYTKOWNIKA --- */}
                <div className="register-field">
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Twój nick"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                {/* --- POLE 2: EMAIL --- */}
                <div className="register-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Podaj email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                {/* --- POLE 3: HASŁO --- */}
                <div className="register-field">
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Podaj hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {/* --- POLE 4: POWTÓRZ HASŁO --- */}
                <div className="register-field">
                    <label htmlFor="confirm">Powtórz hasło</label>
                    <input
                        id="confirm"
                        type="password"
                        placeholder="Powtórz hasło"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                    />
                </div>

                {error && <div className="register-error">{error}</div>}

                <button className="register-btn" type="submit">
                    Zarejestruj się
                </button>

                {onBackToLogin && (
                    <button
                        className="back-login-btn"
                        type="button"
                        onClick={onBackToLogin}
                        style={{ marginTop: "0.9rem" }}
                    >
                        Powrót do logowania
                    </button>
                )}
            </form>
        </div>
    );
}