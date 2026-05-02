import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ChevronRight } from 'lucide-react';
import styles from './DeckCard.module.css';

/** @param {{ deck: import('../../../data/mockData').flashcardDecks[number], index: number }} props */
export function DeckCard({ deck, index }) {
  const progress = Math.round((deck.studied / deck.cardCount) * 100);

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <div className={`${styles.cardTop} ${styles[`color_${deck.color}`]}`}>
        <Layers size={22} aria-hidden='true' />
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{deck.category}</span>
        <h3 className={styles.title}>{deck.title}</h3>
        <p className={styles.description}>{deck.description}</p>

        <div className={styles.meta}>
          <span>{deck.cardCount} kart</span>
          <span>{progress}% opanowane</span>
        </div>

        <div className={styles.progressTrack} aria-label={`Postęp: ${progress}%`}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <Link to={`/flashcards/${deck.id}/study`} className={styles.studyBtn}>
          Ucz się
          <ChevronRight size={15} aria-hidden='true' />
        </Link>
      </div>
    </motion.article>
  );
}
