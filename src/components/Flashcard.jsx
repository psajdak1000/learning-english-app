import { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ word, answer }) {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const speakEnglishWord = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    
    utterance.lang = 'en-US';
    utterance.rate = 0.75;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
    if (premiumVoice) utterance.voice = premiumVoice;

    window.speechSynthesis.speak(utterance);
  };

  const handleCheck = (e) => {
    e.preventDefault();
    const normalizedUser = userInput.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    if (!normalizedUser) return;

    const isCorrect = normalizedUser === normalizedAnswer;
    setResult(isCorrect ? 'correct' : 'wrong');
    setIsFlipped(true);
  };

  const resetCard = () => {
    setUserInput('');
    setResult(null);
    setIsFlipped(false);
  };

  return (
    <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`}>
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
              autoFocus
            />
            <button type="submit" className="flashcard-check-btn">
              Sprawdź
            </button>
          </form>
        </div>

        <div className="flashcard-back">
          {result === 'correct' ? (
            <div className="feedback-content">
              <div className="checkmark">✅</div>
              <h3 className="success-text">Bardzo dobrze!</h3>
            </div>
          ) : (
            <div className="feedback-content">
              <div className="crossmark">❌</div>
              <h3 className="fail-text">Poprawna odpowiedź:</h3>
              <p className="answer-text">{answer}</p>
            </div>
          )}
          
          <button 
            className="speaker-btn" 
            onClick={speakEnglishWord}
            title="Odsłuchaj wymowę"
          >
            🎧 Odsłuchaj
          </button>

          <button className="reset-btn" onClick={resetCard}>
            Następne słowo
          </button>
        </div>
      </div>
    </div>
  );
}
