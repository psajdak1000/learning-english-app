import styles from './StudyCard.module.css';

/**
 * @param {{
 *   card: { front: string, back: string, example?: string },
 *   isFlipped: boolean,
 *   onFlip: () => void,
 * }} props
 */
export function StudyCard({ card, isFlipped, onFlip }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  }

  return (
    <div
      className={styles.scene}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      aria-label={isFlipped ? 'Karta odwrócona — widzisz tłumaczenie' : 'Kliknij, aby zobaczyć tłumaczenie'}
    >
      <div className={`${styles.inner} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front — English word */}
        <div className={`${styles.face} ${styles.faceFront}`}>
          <span className={styles.faceLabel}>słowo</span>
          <span className={styles.word}>{card.front}</span>
          <span className={styles.hint}>Kliknij, aby zobaczyć tłumaczenie</span>
        </div>

        {/* Back — Polish translation */}
        <div className={`${styles.face} ${styles.faceBack}`}>
          <span className={styles.faceLabel}>tłumaczenie</span>
          <span className={styles.translation}>{card.back}</span>
          {card.example && (
            <p className={styles.example}>
              <span className={styles.exampleQuote}>przykład</span>
              {card.example}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
