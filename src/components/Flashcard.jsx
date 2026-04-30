import { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ word, answer }) {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null); // null, 'correct', 'wrong'
  const [isFlipped, setIsFlipped] = useState(false); // NOWE: stan obrócenia

  const handleCheck = e => {
    e.preventDefault();
    const normalizedUser = userInput.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    if (!normalizedUser) return;

    const isCorrect = normalizedUser === normalizedAnswer;
    setResult(isCorrect ? 'correct' : 'wrong');
    setIsFlipped(true); // OBRÓĆ fiszkę po sprawdzeniu!
  };

  const resetCard = () => {
    setUserInput('');
    setResult(null);
    setIsFlipped(false);
  };

  return (
    <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}>
      {/* PRZÓD fiszki - input */}
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <h2 className="flashcard-word">{word}</h2>
          <form className="flashcard-form" onSubmit={handleCheck}>
            <input
              type="text"
              className="flashcard-input"
              placeholder="Wpisz tłumaczenie..."
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
            />
            <button type="submit" className="flashcard-check-btn">
              Sprawdź
            </button>
          </form>
        </div>

        {/* TYŁ fiszki - wynik */}
        <div className="flashcard-back">
          {result === 'correct' ? (
            <>
              <div className="checkmark">✅</div>
              <h3 className="success-text">Dobrze!</h3>
              <p className="answer-text">{answer}</p>
            </>
          ) : (
            <>
              <div className="crossmark">❌</div>
              <h3 className="fail-text">Spróbuj jeszcze raz!</h3>
              <p className="answer-text">Poprawnie: {answer}</p>
            </>
          )}
          <button className="reset-btn" onClick={resetCard}>
            Następna
          </button>
        </div>
      </div>
    </div>
  );
}
