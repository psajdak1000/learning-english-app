import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Trophy } from 'lucide-react';
import styles from './Hero.module.css';

const floatAnimation = (y = 8, duration = 3) => ({
  animate: {
    y: [0, -y, 0],
    transition: { duration, repeat: Infinity, ease: 'easeInOut' },
  },
});

const cards = [
  {
    id: 'word',
    delay: 0,
    float: floatAnimation(10, 3.4),
    className: styles.cardWord,
    content: (
      <>
        <p className={styles.cardLabel}>Słowo dnia</p>
        <p className={styles.cardWord}>Eloquent</p>
        <p className={styles.cardDefinition}>
          Płynny i przekonujący w mowie lub piśmie.
        </p>
        <div className={styles.cardActions}>
          <button className={styles.cardBtn}>Znam</button>
          <button className={`${styles.cardBtn} ${styles.cardBtnOutline}`}>Powtórz później</button>
        </div>
      </>
    ),
  },
  {
    id: 'streak',
    delay: 0.15,
    float: floatAnimation(6, 2.8),
    className: styles.cardStreak,
    content: (
      <>
        <Zap size={20} className={styles.cardIcon} aria-hidden='true' />
        <div>
          <p className={styles.cardStreakNumber}>14</p>
          <p className={styles.cardLabel}>Dni z rzędu</p>
        </div>
      </>
    ),
  },
  {
    id: 'rank',
    delay: 0.3,
    float: floatAnimation(7, 3.1),
    className: styles.cardRank,
    content: (
      <>
        <Trophy size={18} className={styles.cardIconGold} aria-hidden='true' />
        <p className={styles.cardLabel}>Miejsce w turnieju</p>
        <p className={styles.cardRankValue}>#4 w tym tygodniu</p>
      </>
    ),
  },
  {
    id: 'quiz',
    delay: 0.45,
    float: floatAnimation(9, 3.6),
    className: styles.cardQuiz,
    content: (
      <>
        <CheckCircle2 size={18} className={styles.cardIconGreen} aria-hidden='true' />
        <p className={styles.cardLabel}>Ostatni wynik quizu</p>
        <p className={styles.cardScore}>92% poprawnych</p>
        <div className={styles.cardProgressBar}>
          <div className={styles.cardProgressFill} style={{ '--fill': '92%' }} />
        </div>
      </>
    ),
  },
];

export function HeroVisual() {
  return (
    <div className={styles.visualContainer} aria-hidden='true'>
      <div className={styles.visualGlow} />
      {cards.map(({ id, delay, float, className, content }) => (
        <motion.div
          key={id}
          className={`${styles.card} ${className}`}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1, ...float.animate }}
          transition={{ duration: 0.45, delay }}
        >
          {content}
        </motion.div>
      ))}
    </div>
  );
}
