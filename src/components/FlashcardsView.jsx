import Flashcard from './Flashcard';

const flashcards = [
  { word: "cat", translation: "kot" },
  { word: "book", translation: "książka" },
  { word: "hello", translation: "cześć" },
  // Dodaj więcej
];

export default function FlashcardsView({ onBack }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '3rem' }}>
      <button
        style={{
          margin: '1rem auto 2rem auto',
          display: 'block',
          background: 'none',
          color: '#e53935',
          border: '2px solid #e53935',
          borderRadius: '10px',
          fontWeight: '600',
          padding: '0.8rem 2rem',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
        onClick={onBack}
      >
        Powrót do strony głównej
      </button>
      <h1 style={{ color: '#fafafa', textAlign: 'center', marginBottom: '2rem' }}>Fiszki</h1>
      {flashcards.map(card => (
        <Flashcard key={card.word} word={card.word} translation={card.translation} />
      ))}
    </div>
  );
}
