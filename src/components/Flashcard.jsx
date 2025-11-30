import { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ word, answer }) {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null); // 'correct' / 'wrong'

  const handleCheck = e => {
    e.preventDefault();
    const normalizedUser = userInput.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    if (!normalizedUser) return;

    if (normalizedUser === normalizedAnswer) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
  };

  return (
    <div className="flashcard">
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

      {result === 'correct' && (
        <p className="flashcard-success">Dobrze!</p>
      )}
      {result === 'wrong' && (
        <p className="flashcard-fail">
          Niedokładnie, poprawna odpowiedź to: {answer}
        </p>
      )}
    </div>
  );
}
