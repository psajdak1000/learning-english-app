import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, LayoutGrid } from 'lucide-react';
import { StudyCard } from '../components/Flashcards/StudyCard/StudyCard';
import { flashcardDecks, flashcardsByDeck } from '../data/mockData';
import styles from './StudyPage.module.css';

export function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const deck = flashcardDecks.find((d) => d.id === deckId);
  const cards = flashcardsByDeck[deckId] ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);

  // Redirect if deck not found
  useEffect(() => {
    if (!deck) navigate('/flashcards', { replace: true });
  }, [deck, navigate]);

  if (!deck || cards.length === 0) return null;

  const card = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  function handleFlip() {
    if (!isFlipped) {
      setIsFlipped(true);
      setIsRevealed(true);
    }
  }

  function handleAnswer(wasKnown) {
    if (wasKnown) {
      setKnown((prev) => [...prev, card.id]);
    } else {
      setUnknown((prev) => [...prev, card.id]);
    }

    if (currentIndex + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
      setIsRevealed(false);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsRevealed(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
  }

  if (done) {
    const knownCount = known.length;
    const unknownCount = unknown.length;
    const pct = Math.round((knownCount / cards.length) * 100);

    return (
      <div className={styles.resultPage}>
        <motion.div
          className={styles.resultCard}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.resultIcon}>
            {pct >= 70 ? (
              <CheckCircle2 size={48} strokeWidth={1.5} className={styles.iconSuccess} />
            ) : (
              <XCircle size={48} strokeWidth={1.5} className={styles.iconWarn} />
            )}
          </div>

          <h1 className={styles.resultTitle}>
            {pct >= 90
              ? 'Doskonale!'
              : pct >= 70
              ? 'Świetna robota!'
              : pct >= 40
              ? 'Niezły wynik!'
              : 'Ćwicz dalej!'}
          </h1>
          <p className={styles.resultSubtitle}>
            Sesja zakończona — <strong>{deck.title}</strong>
          </p>

          <div className={styles.resultStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue + ' ' + styles.statKnown}>{knownCount}</span>
              <span className={styles.statLabel}>Znam</span>
            </div>
            <div className={styles.statDivider} aria-hidden='true' />
            <div className={styles.statItem}>
              <span className={styles.statValue + ' ' + styles.statUnknown}>{unknownCount}</span>
              <span className={styles.statLabel}>Nie znam</span>
            </div>
            <div className={styles.statDivider} aria-hidden='true' />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{pct}%</span>
              <span className={styles.statLabel}>Wynik</span>
            </div>
          </div>

          <div className={styles.resultActions}>
            <button className={styles.restartBtn} onClick={handleRestart}>
              <RotateCcw size={16} aria-hidden='true' />
              Ucz się ponownie
            </button>
            <Link to='/flashcards' className={styles.backBtn}>
              <LayoutGrid size={16} aria-hidden='true' />
              Wszystkie zestawy
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={`${styles.topBar} container`}>
        <Link to='/flashcards' className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden='true' />
          Zestawy
        </Link>
        <span className={styles.deckTitle}>{deck.title}</span>
        <span className={styles.cardCount}>
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack} aria-label={`Postęp: karta ${currentIndex + 1} z ${cards.length}`}>
        <motion.div
          className={styles.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Study area */}
      <div className={styles.studyArea}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            className={styles.cardWrapper}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22 }}
          >
            <StudyCard card={card} isFlipped={isFlipped} onFlip={handleFlip} />
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className={styles.actions}>
          {!isRevealed ? (
            <button className={styles.revealBtn} onClick={handleFlip}>
              Pokaż tłumaczenie
            </button>
          ) : (
            <motion.div
              className={styles.answerBtns}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button className={styles.unknownBtn} onClick={() => handleAnswer(false)}>
                <XCircle size={18} aria-hidden='true' />
                Nie znam
              </button>
              <button className={styles.knownBtn} onClick={() => handleAnswer(true)}>
                <CheckCircle2 size={18} aria-hidden='true' />
                Znam
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
