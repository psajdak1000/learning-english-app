import { useState } from 'react';
import './Login.css'; 

function Login({ onLogin, onBackToHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Wszystkie pola są wymagane!');
      return;
    }
    setError('');
    onLogin && onLogin({ email, password });
  };

  return (
    <div className="login-bg">
      {/* Przycisk powrotu */}
      {onBackToHome && (
        <button className="back-btn" onClick={onBackToHome}>
          ← Powrót do strony głównej
        </button>
      )}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Logowanie</h2>
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="Podaj email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          Nie masz konta? <a href="#">Załóż konto</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
