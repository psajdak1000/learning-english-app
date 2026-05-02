import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { footerLinks } from '../../../data/mockData';
import styles from './Footer.module.css';

const socialLinks = [
  { label: 'GitHub', icon: Github, href: 'https://github.com' },
  { label: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label='Site footer'>
      <div className={`${styles.inner} container`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to='/' className={styles.logo}>
              <span className={styles.logoDot} aria-hidden='true' />
              Fluent
            </Link>
            <p className={styles.tagline}>
              Opanuj angielski dzięki codziennej praktyce, inteligentnym powtórkom
              i prawdziwym rozmowom.
            </p>
            <div className={styles.socials}>
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.socialLink}
                  aria-label={label}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Icon size={18} aria-hidden='true' />
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.linkGroups} aria-label='Footer navigation'>
            <div className={styles.linkGroup}>
              <h3 className={styles.groupHeading}>Produkt</h3>
              <ul role='list'>
                {footerLinks.product.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.groupHeading}>Firma</h3>
              <ul role='list'>
                {footerLinks.company.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.groupHeading}>Prawne</h3>
              <ul role='list'>
                {footerLinks.legal.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path} className={styles.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {year} Fluent. Wszelkie prawa zastrzeżone.
          </p>
          <p className={styles.madeWith}>
            Stworzone przez uczących się, dla uczących się.
          </p>
        </div>
      </div>
    </footer>
  );
}
