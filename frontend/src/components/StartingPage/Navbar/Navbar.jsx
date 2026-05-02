import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../../../data/mockData';
import styles from './Navbar.module.css';

/** @param {{ theme: string, toggleTheme: () => void }} props */
export function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`} aria-label='Main navigation'>
        <Link to='/' className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoDot} aria-hidden='true' />
          Fluent
        </Link>

        <ul className={styles.navLinks} role='list'>
          {navLinks.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Przełącz na tryb ${theme === 'dark' ? 'jasny' : 'ciemny'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to='/login' className={styles.btnGhost}>
            Zaloguj się
          </Link>
          <Link to='/register' className={styles.btnPrimary}>
            Zarejestruj się
          </Link>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <ul role='list'>
              {navLinks.map(({ label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `${styles.mobileLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={styles.mobileActions}>
              <Link to='/login' className={styles.btnGhost} onClick={() => setMenuOpen(false)}>
                Zaloguj się
              </Link>
              <Link
                to='/register'
                className={styles.btnPrimary}
                onClick={() => setMenuOpen(false)}
              >
                Zarejestruj się
              </Link>
              <button
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={`Przełącz na tryb ${theme === 'dark' ? 'jasny' : 'ciemny'}`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
