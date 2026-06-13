import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { getLatestResult, getResultsHistory } from '../api/resultsApi';
import { getCurrentUser } from '../api/tokenStorage';
import styles from './ResultsPage.module.css';

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('pl-PL');
  } catch {
    return value;
  }
}

export function ResultsPage() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = useMemo(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.id) return String(currentUser.id);
    return 'demo-user';
  }, []);

  async function loadResults() {
    setLoading(true);
    setError('');
    try {
      const [latestData, historyData] = await Promise.all([
        getLatestResult(userId).catch((err) => {
          if (err?.status === 404) return null;
          throw err;
        }),
        getResultsHistory(userId),
      ]);

      setLatest(latestData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      setError(err?.message || 'Nie udalo sie pobrac historii wynikow.');
      setLatest(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className='container'>
        <header className={styles.header}>
          <h1>Historia wynikow</h1>
          <p>Podglad endpointow /api/results/latest i /api/results/history.</p>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelTop}>
            <h2>User: {userId}</h2>
            <button type='button' className={styles.primaryBtn} onClick={loadResults}>
              <RefreshCw size={16} />
              {loading ? 'Odswiezanie...' : 'Odswiez historie'}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && !latest && history.length === 0 && (
            <p className={styles.info}>Brak danych. Wykonaj quiz i odswiez historie.</p>
          )}

          {latest && (
            <div className={styles.latestCard}>
              <h3>Ostatni wynik</h3>
              <div className={styles.latestGrid}>
                <p>
                  <span>Data:</span>
                  <strong>{formatDate(latest.executedAt)}</strong>
                </p>
                <p>
                  <span>Pytania:</span>
                  <strong>{latest.questionCount}</strong>
                </p>
                <p>
                  <span>Poprawne:</span>
                  <strong>{latest.correctAnswers}</strong>
                </p>
                <p>
                  <span>Procent:</span>
                  <strong>{latest.percentageScore}%</strong>
                </p>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Liczba pytan</th>
                    <th>Poprawne</th>
                    <th>Procent</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id}>
                      <td>{formatDate(row.executedAt)}</td>
                      <td>{row.questionCount}</td>
                      <td>{row.correctAnswers}</td>
                      <td>{row.percentageScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
