import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './AuthLayout.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

/**
 * @param {{ title: string, subtitle: string, children: React.ReactNode }} props
 */
export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden='true'>
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
      </div>

      <motion.div
        className={styles.card}
        variants={fadeUp}
        initial='hidden'
        animate='visible'
      >
        <div className={styles.cardHeader}>
          <Link to='/' className={styles.logo}>
            <span className={styles.logoDot} aria-hidden='true' />
            Fluent
          </Link>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {children}
      </motion.div>
    </div>
  );
}
