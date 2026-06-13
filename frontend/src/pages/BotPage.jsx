import { useState } from 'react';
import { askBot } from '../api/botApi';
import styles from './BotPage.module.css';

export function BotPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk(event) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError('Wpisz pytanie do AI.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const data = await askBot(trimmed);
      setAnswer(data?.answer || 'Brak odpowiedzi.');
    } catch (err) {
      setError(err?.message || 'Nie udalo sie pobrac odpowiedzi AI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className='container'>
        <header className={styles.header}>
          <h1>AI Chat</h1>
          <p>Zapytaj model jezykowy przez backend (`/api/bot/ask`).</p>
        </header>

        <section className={styles.panel}>
          <form className={styles.form} onSubmit={handleAsk}>
            <label htmlFor='bot-question'>Twoje pytanie</label>
            <textarea
              id='bot-question'
              rows={4}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder='Explain the difference between borrow and lend'
            />
            <button type='submit' className={styles.primaryBtn} disabled={loading}>
              {loading ? 'Wysylanie...' : 'Zapytaj AI'}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.answerBox}>
            <h2>Odpowiedz</h2>
            <p>{answer || 'Tutaj pojawi sie odpowiedz modelu.'}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
