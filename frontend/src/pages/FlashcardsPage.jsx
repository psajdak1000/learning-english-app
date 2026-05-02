import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { DeckCard } from '../components/Flashcards/DeckCard/DeckCard';
import { flashcardDecks } from '../data/mockData';
import styles from './FlashcardsPage.module.css';

export function FlashcardsPage() {
  return (
    <div className={styles.page}>
      <div className={`${styles.header} container`}>
        <motion.div
          className={styles.headerText}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className={styles.heading}>Twoje fiszki</h1>
          <p className={styles.subtext}>
            Przeglądaj gotowe zestawy lub utwórz własny i ucz się w swoim tempie.
          </p>
        </motion.div>

        <motion.button
          className={styles.newDeckBtn}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          /* TODO: open new deck modal */
        >
          <Plus size={17} aria-hidden='true' />
          Nowy zestaw
        </motion.button>
      </div>

      <section className={`${styles.grid} container`} aria-label='Zestawy fiszek'>
        {flashcardDecks.map((deck, index) => (
          <DeckCard key={deck.id} deck={deck} index={index} />
        ))}
      </section>
    </div>
  );
}
