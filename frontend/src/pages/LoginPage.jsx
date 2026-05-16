import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthLayout } from '../components/Auth/AuthLayout/AuthLayout';
import styles from './AuthPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.email.trim()) {
      next.email = 'Adres e-mail jest wymagany.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Podaj poprawny adres e-mail.';
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setIsSubmitting(true);
    /* TODO: wire up real auth API call here */
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    navigate('/');
  }

  return (
    <AuthLayout title='Zaloguj się' subtitle='Witaj z powrotem — kontynuuj naukę tam, gdzie skończyłeś.'>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='login-email'>
            Adres e-mail
          </label>
          <input
            id='login-email'
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            type='email'
            name='email'
            autoComplete='email'
            placeholder='twoj@email.com'
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className={styles.errorMsg} role='alert'>
              {errors.email}
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
