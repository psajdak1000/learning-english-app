import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthLayout } from '../components/Auth/AuthLayout/AuthLayout';
import { login } from '../api/authApi';
import { setCurrentUser, setToken } from '../api/tokenStorage';
import styles from './AuthPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const next = {};
    if (!form.username.trim()) {
      next.username = 'Nazwa użytkownika jest wymagana.';
    }
    if (!form.password) {
      next.password = 'Hasło jest wymagane.';
    }
    return next;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const data = await login({
        username: form.username.trim(),
        password: form.password,
      });
      setToken(data.accessToken);
      setCurrentUser(data.user);
      navigate('/');
    } catch (err) {
      if (err?.status === 401) {
        setSubmitError('Nieprawidłowa nazwa użytkownika lub hasło.');
      } else {
        setSubmitError(err?.message || 'Nie udało się zalogować.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title='Zaloguj się' subtitle='Witaj z powrotem — kontynuuj naukę tam, gdzie skończyłeś.'>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='login-username'>
            Nazwa użytkownika lub e-mail
          </label>
          <input
            id='login-username'
            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
            type='text'
            name='username'
            autoComplete='username'
            placeholder='janek lub janek@example.com'
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && (
            <span className={styles.errorMsg} role='alert'>
              {errors.username}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor='login-password'>
              Hasło
            </label>
            <Link to='/forgot-password' className={styles.forgotLink}>
              Nie pamiętasz hasła?
            </Link>
          </div>
          <div className={styles.inputWrapper}>
            <input
              id='login-password'
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              type={showPassword ? 'text' : 'password'}
              name='password'
              autoComplete='current-password'
              placeholder='••••••••'
              value={form.password}
              onChange={handleChange}
            />
            <button
              type='button'
              className={styles.eyeToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorMsg} role='alert'>
              {errors.password}
            </span>
          )}
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type='checkbox'
            className={styles.checkbox}
            name='remember'
            checked={form.remember}
            onChange={handleChange}
          />
          Zapamiętaj mnie
        </label>

        {submitError && (
          <span className={styles.errorMsg} role='alert'>
            {submitError}
          </span>
        )}

        <button type='submit' className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className={styles.spinner} aria-hidden='true' />
          ) : (
            <LogIn size={17} aria-hidden='true' />
          )}
          {isSubmitting ? 'Logowanie…' : 'Zaloguj się'}
        </button>
      </form>

      <p className={styles.switchText}>
        Nie masz konta?{' '}
        <Link to='/register' className={styles.switchLink}>
          Zarejestruj się za darmo
        </Link>
      </p>
    </AuthLayout>
  );
}
