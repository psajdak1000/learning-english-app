import { motion } from 'framer-motion';
import { features } from '../../../data/mockData';
import { FeatureCard } from './FeatureCard';
import styles from './Features.module.css';

export function Features() {
  return (
    <section className={styles.section} id='features' aria-labelledby='features-heading'>
      <div className={`${styles.inner} container`}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className={styles.eyebrow}>Wszystko czego potrzebujesz</span>
          <h2 id='features-heading' className={styles.heading}>
            Jedna aplikacja. Każda umiejętność.
          </h2>
          <p className={styles.subtext}>
            Od ćwiczeń słownikowych po turnieje na żywo — Fluent obejmuje pełne
            spektrum nauki języka w jednym, spójnym doświadczeniu.
          </p>
        </motion.div>

        <ul className={styles.grid} role='list'>
          {features.map((feature, index) => (
            <li key={feature.id}>
              <FeatureCard feature={feature} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
