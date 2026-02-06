import { useState } from 'react';
import Flashcard from './Flashcard';
import './FlashcardsView.css';

const categories = {
  animals: {
    name: 'Zwierzęta 🦁',
    cards: [
      { word: 'cat', answer: 'kot' },
      { word: 'dog', answer: 'pies' },
      { word: 'sheep', answer: 'owca' },
      { word: 'lion', answer: 'lew' },
      { word: 'elephant', answer: 'słoń' },
    ],
  },
  basics: {
    name: 'Podstawy 💬',
    cards: [
      { word: 'hello', answer: 'cześć' },
      { word: 'water', answer: 'woda' },
      { word: 'thank you', answer: 'dziękuję' },
      { word: 'please', answer: 'proszę' },
      { word: 'friend', answer: 'przyjaciel' },
    ],
  },
  food: {
    name: 'Jedzenie 🍕',
    cards: [
      { word: 'bread', answer: 'chleb' },
      { word: 'apple', answer: 'jabłko' },
      { word: 'cheese', answer: 'ser' },
      { word: 'milk', answer: 'mleko' },
      { word: 'vegetables', answer: 'warzywa' },
    ],
  },
  travel: {
    name: 'Podróże ✈️',
    cards: [
      { word: 'airport', answer: 'lotnisko' },
      { word: 'train', answer: 'pociąg' },
      { word: 'ticket', answer: 'bilet' },
      { word: 'hotel', answer: 'hotel' },
      { word: 'passport', answer: 'paszport' },
    ],
  },
  colors: {
    name: 'Kolory 🎨',
    cards: [
      { word: 'red', answer: 'czerwony' },
      { word: 'blue', answer: 'niebieski' },
      { word: 'green', answer: 'zielony' },
      { word: 'yellow', answer: 'żółty' },
      { word: 'white', answer: 'biały' },
    ],
  },
  emotions: {
    name: 'Emocje 😊',
    cards: [
      { word: 'happy', answer: 'szczęśliwy' },
      { word: 'sad', answer: 'smutny' },
      { word: 'angry', answer: 'zły' },
      { word: 'tired', answer: 'zmęczony' },
      { word: 'bored', answer: 'znudzony' },
    ],
  },
  technology: {
    name: 'Technologia 💻',
    cards: [
      { word: 'computer', answer: 'komputer' },
      { word: 'keyboard', answer: 'klawiatura' },
      { word: 'screen', answer: 'ekran' },
      { word: 'internet', answer: 'internet' },
      { word: 'mouse', answer: 'myszka' },
    ],
  }
};

export default function FlashcardsView({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelectCategory = (key) => {
    setSelectedCategory(key);
    setCurrentIndex(0);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    const total = categories[selectedCategory].cards.length;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    const total = categories[selectedCategory].cards.length;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-top-nav">
        <button className="flashcards-back-btn" onClick={onBack}>
          Powrót do strony głównej
        </button>
      </div>

      {!selectedCategory ? (
        <div className="centered-selection">
          <h1 className="flashcards-main-title">Wybierz kategorię</h1>
          <div className="flashcards-categories-grid">
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
        </div>
      ) : (
        <div className="single-flashcard-container">
          <div className="category-header">
            <h2 className="selected-category-name">{categories[selectedCategory].name}</h2>
            <button className="change-category-link" onClick={handleBackToCategories}>
              ← Zmień kategorię
            </button>
          </div>

          <div className="flashcard-carousel">
            <button className="carousel-nav-btn" onClick={handlePrev}>‹</button>
            
            <div className="active-card-wrapper">
              <div className="progress-label">Fiszka {currentIndex + 1} z {categories[selectedCategory].cards.length}</div>
              <Flashcard 
                key={`${selectedCategory}-${currentIndex}`} 
                word={categories[selectedCategory].cards[currentIndex].word} 
                answer={categories[selectedCategory].cards[currentIndex].answer} 
              />
            </div>
            
            <button className="carousel-nav-btn" onClick={handleNext}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}
