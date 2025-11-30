import { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ word, translation }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [answered, setAnswered] = useState(null);

  return (
    <div className="flashcard">
      <h2 className="flashcard-word">{word}</h2>
      {!showTranslation ? (
        <button className="flashcard-show-btn" onClick={() => setShowTranslation(true)}>
          Pokaż tłumaczenie
        </button>
      ) : (
        <>
          <div className="flashcard-translation">{translation}</div>
          <div className="flashcard-knowledge">
            <p>Czy znałeś odpowiedź?</p>
            <button className="flashcard-yes-btn" onClick={() => setAnswered(true)}>Tak</button>
            <button className="flashcard-no-btn" onClick={() => setAnswered(false)}>Nie</button>
          </div>
          {answered === true && (
            <p className="flashcard-success">Super!</p>
          )}
          {answered === false && (
            <p className="flashcard-fail">Próbuj dalej!</p>
          )}
        </>
      )}
    </div>
  );
}
