import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroVisual } from './HeroVisual';
import styles from './Hero.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  }),
};

export function Hero() {
  return (
    <section className={styles.hero} aria-label='Hero'>
      <div className={`${styles.inner} container`}>
        <div className={styles.content}>
          <motion.div
            className={styles.badge}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            custom={0}
          >
            <span className={styles.badgeDot} aria-hidden='true' />
            
          </motion.div>

          <motion.h1
            className={styles.heading}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            custom={0.1}
          >
            Angielski, który zostaje —<br />
            <span className={styles.headingAccent}>nie tylko na egzamin.</span>
          </motion.h1>

          <motion.p
            className={styles.subtext}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            custom={0.2}
          >
            Fluent łączy adaptacyjne quizy, fiszki z powtórkami rozłożonymi w czasie,
            turnieje na żywo i korepetytora AI w jednym, spójnym doświadczeniu.
            Pięć minut dziennie buduje prawdziwą płynność.
          </motion.p>

          <motion.div
            className={styles.cta}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            custom={0.3}
          >
            <Link to='/register' className={styles.btnPrimary}>
              Zacznij uczyć się za darmo
              <ArrowRight size={18} aria-hidden='true' />
            </Link>
            <Link to='/demo' className={styles.btnSecondary}>
              <Play size={16} aria-hidden='true' />
              Jak to działa
            </Link>
          </motion.div>

          <motion.p
            className={styles.disclaimer}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            custom={0.4}
          >
            Zawsze za darmo — żadnej karty kredytowej
          </motion.p>
        </div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
