import { useState, useEffect } from 'react';
import './QuizView.css';

const quizData = [
  { question: "What animal says 'meow'?", options: ["Dog", "Cat", "Cow", "Bird"], correct: 1 },
  { question: "How do you say 'cześć' in English?", options: ["Goodbye", "Hello", "Please", "Thank you"], correct: 1 },
  { question: "Which word means 'pies'?", options: ["Cat", "Dog", "Horse", "Fish"], correct: 1 },
  { question: "What is 'book' in Polish?", options: ["Drzewo", "Kniha", "Książka", "Stół"], correct: 2 },
  { question: "Choose the correct sentence:", options: ["I go to school", "I goes to school", "I going to school", "I go school"], correct: 0 },
];

export default function QuizView({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Czas minął
    }
  }, [timeLeft, isAnswered]);

  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(nextQuestion, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnswered]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === quizData[currentQuestion].correct) {
      setScore(score + 10);
    }
    setTimeLeft(15);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(-1);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setGameOver(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(-1);
    setIsAnswered(false);
    setTimeLeft(15);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="quiz-game-over">
        <div className="quiz-score">Wynik: {score}/50 pkt</div>
        <div className="quiz-rank">
          {score >= 45 && '🏆 Expert!'}
          {score >= 30 && score < 45 && '⭐ Bardzo dobrze!'}
          {score >= 20 && score < 30 && '👍 Dobrze!'}
          {score < 20 && '📚 Ćwicz dalej!'}
        </div>
        <button className="quiz-btn quiz-restart" onClick={restartQuiz}>Jeszcze raz</button>
        <button className="quiz-btn quiz-back" onClick={onBack}>Powrót</button>
      </div>
    );
  }

  const q = quizData[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="quiz-back" onClick={onBack}>← Powrót</button>
        <div className="quiz-stats">
          Pytanie {currentQuestion + 1}/{quizData.length} | Wynik: {score} pkt
        </div>
        <div className="quiz-timer">⏰ {timeLeft}s</div>
      </div>

      <div className="quiz-question">
        <h2>{q.question}</h2>
      </div>

      <div className="quiz-options">
        {q.options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${selectedAnswer === index ? (index === q.correct ? 'correct' : 'wrong') : ''}`}
            onClick={() => !isAnswered && handleAnswer(index)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
