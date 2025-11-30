import { useState } from 'react';
import './Register.css';

export default function Register({ onRegister, onBackToHome, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError('Wszystkie pola są wymagane!');
      return;
    }
    if (password !== confirm) {
      setError('Hasła muszą się zgadzać!');
      return;
    }
    setError('');
    onRegister && onRegister({ email, password });
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
            style={{ marginTop: '0.9rem' }}
          >
            Powrót do logowania
          </button>
        )}
      </form>
    </div>
  );
}
