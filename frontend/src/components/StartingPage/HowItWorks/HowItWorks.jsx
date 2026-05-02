import { motion } from 'framer-motion';
import { steps } from '../../../data/mockData';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  return (
    <section className={styles.section} id='how-it-works' aria-labelledby='how-heading'>
      <div className={`${styles.inner} container`}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className={styles.eyebrow}>Jak zacząć</span>
          <h2 id='how-heading' className={styles.heading}>
            Gotowy w kilka minut
          </h2>
          <p className={styles.subtext}>
            Żadnej długiej konfiguracji. Żadnego skomplikowanego onboardingu. Otwórz aplikację i zacznij się uczyć.
          </p>
        </motion.div>

        <ol className={styles.stepList} role='list'>
          {steps.map((step, index) => (
            <motion.li
              key={step.id}
              className={styles.step}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <div className={styles.stepLeft}>
                <div className={styles.stepNumber} aria-hidden='true'>
                  {String(step.id).padStart(2, '0')}
                </div>
                {index < steps.length - 1 && (
                  <div className={styles.connector} aria-hidden='true' />
                )}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
