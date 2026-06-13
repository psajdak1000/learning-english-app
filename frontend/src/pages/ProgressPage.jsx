import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { getProgress } from '../api/progressApi';
import { getCurrentUser } from '../api/tokenStorage';
import styles from './ProgressPage.module.css';

export function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = useMemo(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.id) return String(currentUser.id);
    return 'demo-user';
  }, []);

  async function loadProgress() {
    setLoading(true);
    setError('');
    try {
      const data = await getProgress(userId);
      setProgress(data || null);
    } catch (err) {
      setError(err?.message || 'Nie udalo sie pobrac postepu.');
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className='container'>
        <header className={styles.header}>
          <h1>Postep nauki</h1>
          <p>Podglad danych endpointu /api/progress dla usera demo.</p>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelTop}>
            <h2>User: {userId}</h2>
            <button type='button' className={styles.primaryBtn} onClick={loadProgress}>
              <RefreshCw size={16} />
              {loading ? 'Odswiezanie...' : 'Odswiez postep'}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {!loading && !error && !progress && (
            <p className={styles.info}>Kliknij "Odswiez postep", aby pobrac dane.</p>
          )}

          {progress && (
            <div className={styles.grid}>
              <article>
                <span>User ID</span>
                <strong>{progress.userId || userId}</strong>
              </article>
              <article>
                <span>Przerobione fiszki</span>
                <strong>{progress.cardsStudied ?? 0}</strong>
              </article>
              <article>
                <span>Poprawne odpowiedzi</span>
                <strong>{progress.correctAnswers ?? 0}</strong>
              </article>
              <article>
                <span>Bledne odpowiedzi</span>
                <strong>{progress.incorrectAnswers ?? 0}</strong>
              </article>
              <article>
                <span>Skutecznosc</span>
                <strong>{progress.successRate ?? 0}%</strong>
              </article>
              <article>
                <span>Ostatnia nauka</span>
                <strong>
                  {progress.lastStudyDate
                    ? new Date(progress.lastStudyDate).toLocaleString('pl-PL')
                    : 'brak'}
                </strong>
              </article>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
