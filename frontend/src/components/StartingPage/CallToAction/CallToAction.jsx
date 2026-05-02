import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './CallToAction.module.css';

export function CallToAction() {
  return (
    <section className={styles.section} aria-labelledby='cta-heading'>
      <div className={`${styles.inner} container`}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.glow} aria-hidden='true' />

          <div className={styles.content}>
            <span className={styles.eyebrow}>Zacznij dzisiaj</span>
            <h2 id='cta-heading' className={styles.heading}>
              Twój następny poziom jest<br />
              o jedną sesję stąd.
            </h2>
            <p className={styles.subtext}>
              Dołącz do ponad 24 000 uczących się, którzy zrobili z angielskiego codzienny nawyk dzięki Fluent.
              Darmowe konto, bez limitu czasu, bez karty kredytowej.
            </p>

            <div className={styles.actions}>
              <Link to='/register' className={styles.btnPrimary}>
                Załóż darmowe konto
                <ArrowRight size={18} aria-hidden='true' />
              </Link>
              <Link to='/login' className={styles.btnGhost}>
                Masz już konto? Zaloguj się
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
