import { useMemo, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { startQuiz, submitQuiz } from '../api/quizzesApi';
import { saveResult } from '../api/resultsApi';
import { updateProgress } from '../api/progressApi';
import { getCurrentUser } from '../api/tokenStorage';
import styles from './QuizPage.module.css';

const DEFAULT_COUNT = 5;
const DEFAULT_DIRECTION = 'EN_TO_PL';

export function QuizPage() {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [direction, setDirection] = useState(DEFAULT_DIRECTION);
  const [questions, setQuestions] = useState([]);
  const [answersById, setAnswersById] = useState({});
  const [result, setResult] = useState(null);

  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [sideMessage, setSideMessage] = useState('');

  const userId = useMemo(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.id) return String(currentUser.id);
    return 'demo-user';
  }, []);

  async function handleStartQuiz() {
    setLoadingStart(true);
    setError('');
    setSideMessage('');
    setResult(null);
    try {
      const data = await startQuiz({
        count: Number(count),
        direction,
      });
      setQuestions(data?.questions || []);
      setAnswersById({});
      if (!data?.questions?.length) {
        setError('Backend nie zwrocil pytan quizowych.');
      }
    } catch (err) {
      setError(err?.message || 'Nie udalo sie uruchomic quizu.');
      setQuestions([]);
    } finally {
      setLoadingStart(false);
    }
  }

  function handleAnswerChange(questionId, value) {
    setAnswersById((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmitQuiz() {
    setLoadingSubmit(true);
    setError('');
    setSideMessage('');

    const answers = questions.map((question) => ({
      flashcardId: question.flashcardId,
      answer: (answersById[question.flashcardId] || '').trim(),
      direction: question.direction || direction,
    }));

    const hasEmptyAnswer = answers.some((item) => !item.answer);
    if (hasEmptyAnswer) {
      setLoadingSubmit(false);
      setError('Uzupelnij wszystkie odpowiedzi przed wyslaniem.');
      return;
    }

    try {
      const data = await submitQuiz({
        userId,
        answers,
      });
      setResult(data);

      const resultPayload = {
        userId,
        questionCount: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        percentageScore: data.percentage,
      };
      const progressPayload = {
        userId,
        cardsStudied: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        incorrectAnswers: Math.max(data.totalQuestions - data.correctAnswers, 0),
      };

      try {
        await saveResult(resultPayload);
        await updateProgress(progressPayload);
        setSideMessage('Wynik zapisany i postep zaktualizowany.');
      } catch (nestedErr) {
        setSideMessage(
          nestedErr?.message || 'Quiz policzony, ale nie udalo sie zapisac wyniku lub postepu.',
        );
      }
    } catch (err) {
      setError(err?.message || 'Nie udalo sie sprawdzic quizu.');
      setResult(null);
    } finally {
      setLoadingSubmit(false);
    }
  }

  function handleResetQuiz() {
    setQuestions([]);
    setAnswersById({});
    setResult(null);
    setError('');
    setSideMessage('');
    setCount(DEFAULT_COUNT);
    setDirection(DEFAULT_DIRECTION);
  }

  return (
    <div className={styles.page}>
      <div className='container'>
        <header className={styles.header}>
          <h1>Quiz</h1>
          <p>Uruchom quiz na podstawie fiszek z backendu.</p>
        </header>

        <section className={styles.panel}>
          <h2>Ustawienia quizu</h2>
          <div className={styles.settings}>
            <label>
              Liczba pytan
              <input
                type='number'
                min='1'
                max='50'
                value={count}
                onChange={(event) => setCount(event.target.value)}
              />
            </label>
            <label>
              Kierunek
              <select value={direction} onChange={(event) => setDirection(event.target.value)}>
                <option value='EN_TO_PL'>EN_TO_PL</option>
                <option value='PL_TO_EN'>PL_TO_EN</option>
              </select>
            </label>
            <button type='button' className={styles.primaryBtn} onClick={handleStartQuiz}>
              <Play size={16} />
              {loadingStart ? 'Ladowanie...' : 'Rozpocznij quiz'}
            </button>
          </div>
        </section>

        {error && <p className={styles.error}>{error}</p>}
        {sideMessage && <p className={styles.info}>{sideMessage}</p>}

        {questions.length > 0 && (
          <section className={styles.panel}>
            <h2>Pytania ({questions.length})</h2>
            <div className={styles.questions}>
              {questions.map((question, index) => (
                <article key={`${question.flashcardId}-${index}`} className={styles.questionCard}>
                  <p className={styles.questionTitle}>
                    {index + 1}. Przetlumacz: <strong>{question.questionText}</strong>
                  </p>
                  <input
                    value={answersById[question.flashcardId] || ''}
                    onChange={(event) => handleAnswerChange(question.flashcardId, event.target.value)}
                    placeholder='Wpisz odpowiedz'
                  />
                </article>
              ))}
            </div>

            <div className={styles.actions}>
              <button type='button' className={styles.primaryBtn} onClick={handleSubmitQuiz}>
                {loadingSubmit ? 'Sprawdzanie...' : 'Sprawdz wynik'}
              </button>
              <button type='button' className={styles.ghostBtn} onClick={handleResetQuiz}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </section>
        )}

        {result && (
          <section className={styles.panel}>
            <h2>Wynik</h2>
            <div className={styles.resultGrid}>
              <div>
                <span>Poprawne odpowiedzi</span>
                <strong>{result.correctAnswers}</strong>
              </div>
              <div>
                <span>Wszystkie pytania</span>
                <strong>{result.totalQuestions}</strong>
              </div>
              <div>
                <span>Procent</span>
                <strong>{result.percentage}%</strong>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
