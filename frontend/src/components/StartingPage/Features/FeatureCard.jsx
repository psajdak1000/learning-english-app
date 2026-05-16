import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Features.module.css';

/** @param {{ feature: import('../../../data/mockData').Feature, index: number }} props */
export function FeatureCard({ feature, index }) {
  const { icon: Icon, title, description, tag, path } = feature;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap} aria-hidden='true'>
          <Icon size={22} />
        </div>
        {tag && <span className={styles.tag}>{tag}</span>}
      </div>

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>

      <Link to={path} className={styles.cardLink}>
        Sprawdź
        <ArrowRight size={15} aria-hidden='true' />
      </Link>
    </motion.article>
  );
}
