import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onBackToHome, onRegisterClick }) {
  // 1. Zmieniamy nazwę zmiennej stanu z 'email' na 'username' dla porządku
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

    // 2. WAŻNE: Wysyłamy obiekt z kluczem 'username', bo tak nazywa się pole w Javie (LoginRequest)
    onLogin && onLogin({ username, password });
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
            {/* 3. Zmieniamy napis dla użytkownika */}
            <label htmlFor="username">Login</label>
            <input
                id="username"
                type="text"  // <--- TU BYŁA ZMIANA (z 'email' na 'text')
                autoComplete="username"
                placeholder="Podaj login (np. admin)"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit">Zaloguj się</button>

          <div className="login-help">
            Nie masz konta?{' '}
            <a href="#" onClick={e => {e.preventDefault(); onRegisterClick && onRegisterClick(); }}>
              Załóż konto
            </a>
          </div>
        </form>
      </div>
  );
}