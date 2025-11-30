import { useState } from 'react';
import Flashcard from './Flashcard';
import './FlashcardsView.css';

const categories = {
  animals: {
    name: 'Zwierzęta',
    cards: [
      { word: 'cat', answer: 'kot' },
      { word: 'dog', answer: 'pies' },
      { word: 'owca', answer: 'sheep' },
    ],
  },
  basics: {
    name: 'Podstawowe słowa',
    cards: [
      { word: 'hello', answer: 'cześć' },
      { word: 'book', answer: 'książka' },
    ],
  },
};

export default function FlashcardsView({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = key => {
    setSelectedCategory(key);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const currentCards = selectedCategory
    ? categories[selectedCategory].cards
    : [];

  return (
    <div className="flashcards-page">
      <button className="flashcards-back-btn" onClick={onBack}>
        Powrót do strony głównej
      </button>

      {!selectedCategory ? (
        <>
          <h1 className="flashcards-title">Wybierz kategorię fiszek</h1>
          <div className="flashcards-categories">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                className="flashcards-category-btn"
                onClick={() => handleSelectCategory(key)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flashcards-header-row">
            <h1 className="flashcards-title">
              {categories[selectedCategory].name}
            </h1>
            <button
              className="flashcards-small-back"
              onClick={handleBackToCategories}
            >
              ← Zmień kategorię
            </button>
          </div>

          <div className="flashcards-list">
            {currentCards.map(card => (
              <Flashcard
                key={card.word}
                word={card.word}
                answer={card.answer}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
