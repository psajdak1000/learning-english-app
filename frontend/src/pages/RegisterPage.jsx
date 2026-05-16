import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { AuthLayout } from '../components/Auth/AuthLayout/AuthLayout';
import styles from './AuthPage.module.css';

function getPasswordStrength(password) {
  if (password.length === 0) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

const strengthLabels = { weak: 'Słabe', fair: 'Przeciętne', good: 'Dobre', strong: 'Silne' };

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getPasswordStrength(form.password);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Imię jest wymagane.';
    if (!form.email.trim()) {
      next.email = 'Adres e-mail jest wymagany.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Podaj poprawny adres e-mail.';
    }
    if (!form.password) {
      next.password = 'Hasło jest wymagane.';
    } else if (form.password.length < 8) {
      next.password = 'Hasło musi mieć co najmniej 8 znaków.';
    }
    if (!form.confirmPassword) {
      next.confirmPassword = 'Potwierdź hasło.';
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Hasła nie są zgodne.';
    }
    if (!form.terms) next.terms = 'Musisz zaakceptować regulamin.';
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
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    navigate('/');
  }

  return (
    <AuthLayout title='Utwórz konto' subtitle=''>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='reg-name'>
            Imię
          </label>
          <input
            id='reg-name'
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            type='text'
            name='name'
            autoComplete='given-name'
            placeholder='Jak masz na imię?'
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className={styles.errorMsg} role='alert'>
              {errors.name}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor='reg-email'>
            Adres e-mail
          </label>
          <input
            id='reg-email'
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
          <label className={styles.label} htmlFor='reg-password'>
            Hasło
          </label>
          <div className={styles.inputWrapper}>
            <input
              id='reg-password'
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              type={showPassword ? 'text' : 'password'}
              name='password'
              autoComplete='new-password'
              placeholder='Min. 8 znaków'
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
          {strength && (
            <div className={styles.strengthRow} aria-label={`Siła hasła: ${strengthLabels[strength]}`}>
              <div className={styles.strengthBars}>
                {['weak', 'fair', 'good', 'strong'].map((level, i) => (
                  <div
                    key={level}
                    className={`${styles.strengthBar} ${
                      ['weak', 'fair', 'good', 'strong'].indexOf(strength) >= i
                        ? styles[`strength_${strength}`]
                        : ''
                    }`}
                  />
                ))}
              </div>
              <span className={`${styles.strengthLabel} ${styles[`strength_${strength}`]}`}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}
          {errors.password && (
            <span className={styles.errorMsg} role='alert'>
              {errors.password}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor='reg-confirm'>
            Potwierdź hasło
          </label>
          <div className={styles.inputWrapper}>
            <input
              id='reg-confirm'
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              type={showConfirm ? 'text' : 'password'}
              name='confirmPassword'
              autoComplete='new-password'
              placeholder='Powtórz hasło'
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type='button'
              className={styles.eyeToggle}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className={styles.errorMsg} role='alert'>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={`${styles.checkboxLabel} ${errors.terms ? styles.checkboxLabelError : ''}`}>
            <input
              type='checkbox'
              className={styles.checkbox}
              name='terms'
              checked={form.terms}
              onChange={handleChange}
            />
            Akceptuję{' '}
            <Link to='/terms' className={styles.switchLink}>
              regulamin
            </Link>{' '}
            i{' '}
            <Link to='/privacy' className={styles.switchLink}>
              politykę prywatności
            </Link>
          </label>
          {errors.terms && (
            <span className={styles.errorMsg} role='alert'>
              {errors.terms}
            </span>
          )}
        </div>

        <button type='submit' className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className={styles.spinner} aria-hidden='true' />
          ) : (
            <UserPlus size={17} aria-hidden='true' />
          )}
          {isSubmitting ? 'Tworzenie konta…' : 'Utwórz konto za darmo'}
        </button>
      </form>

      <p className={styles.switchText}>
        Masz już konto?{' '}
        <Link to='/login' className={styles.switchLink}>
          Zaloguj się
        </Link>
      </p>
    </AuthLayout>
  );
}
