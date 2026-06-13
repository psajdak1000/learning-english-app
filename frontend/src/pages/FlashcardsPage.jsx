import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
  updateFlashcard,
} from '../api/flashcardsApi';
import styles from './FlashcardsPage.module.css';

const initialForm = {
  englishWord: '',
  polishTranslation: '',
  exampleUsage: '',
  difficultyLevel: '',
  category: '',
};

export function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({ category: '', difficultyLevel: '' });

  const title = useMemo(
    () => (editingId ? `Edytujesz fiszke #${editingId}` : 'Dodaj nowa fiszke'),
    [editingId],
  );

  useEffect(() => {
    loadFlashcards();
  }, []);

  async function loadFlashcards(activeFilters = filters) {
    setLoading(true);
    setError('');
    try {
      const data = await getFlashcards(activeFilters);
      setFlashcards(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Nie udalo sie pobrac fiszek.');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function validateForm() {
    if (!form.englishWord.trim()) return 'Uzupelnij englishWord.';
    if (!form.polishTranslation.trim()) return 'Uzupelnij polishTranslation.';
    if (!form.exampleUsage.trim()) return 'Uzupelnij exampleUsage.';
    if (!form.difficultyLevel.trim()) return 'Uzupelnij difficultyLevel.';
    if (!form.category.trim()) return 'Uzupelnij category.';
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSaving(true);
    setError('');
    const payload = {
      englishWord: form.englishWord.trim(),
      polishTranslation: form.polishTranslation.trim(),
      exampleUsage: form.exampleUsage.trim(),
      difficultyLevel: form.difficultyLevel.trim(),
      category: form.category.trim(),
    };

    try {
      if (editingId) {
        await updateFlashcard(editingId, payload);
      } else {
        await createFlashcard(payload);
      }
      resetForm();
      await loadFlashcards();
    } catch (err) {
      setError(err?.message || 'Nie udalo sie zapisac fiszki.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(card) {
    setEditingId(card.id);
    setForm({
      englishWord: card.englishWord || '',
      polishTranslation: card.polishTranslation || '',
      exampleUsage: card.exampleUsage || '',
      difficultyLevel: card.difficultyLevel || '',
      category: card.category || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(cardId) {
    const confirmed = window.confirm('Czy na pewno usunac te fiszke?');
    if (!confirmed) return;

    setError('');
    try {
      await deleteFlashcard(cardId);
      if (editingId === cardId) {
        resetForm();
      }
      await loadFlashcards();
    } catch (err) {
      setError(err?.message || 'Nie udalo sie usunac fiszki.');
    }
  }

  async function handleApplyFilters() {
    await loadFlashcards(filters);
  }

  async function handleClearFilters() {
    const emptyFilters = { category: '', difficultyLevel: '' };
    setFilters(emptyFilters);
    await loadFlashcards(emptyFilters);
  }

  return (
    <div className={styles.page}>
      <div className='container'>
        <header className={styles.header}>
          <h1>Fiszki</h1>
          <p>CRUD fiszek podlaczony do backendu.</p>
        </header>

        <section className={styles.panel}>
          <h2>{title}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              English word
              <input
                name='englishWord'
                value={form.englishWord}
                onChange={handleInputChange}
                placeholder='np. apple'
              />
            </label>
            <label>
              Polish translation
              <input
                name='polishTranslation'
                value={form.polishTranslation}
                onChange={handleInputChange}
                placeholder='np. jablko'
              />
            </label>
            <label>
              Example usage
              <input
                name='exampleUsage'
                value={form.exampleUsage}
                onChange={handleInputChange}
                placeholder='np. I eat an apple every day.'
              />
            </label>
            <label>
              Difficulty level
              <input
                name='difficultyLevel'
                value={form.difficultyLevel}
                onChange={handleInputChange}
                placeholder='np. A1'
              />
            </label>
            <label>
              Category
              <input
                name='category'
                value={form.category}
                onChange={handleInputChange}
                placeholder='np. Food'
              />
            </label>

            <div className={styles.formActions}>
              <button type='submit' className={styles.primaryBtn} disabled={isSaving}>
                <Plus size={16} />
                {isSaving ? 'Zapisywanie...' : editingId ? 'Zapisz zmiany' : 'Dodaj fiszke'}
              </button>
              {editingId && (
                <button type='button' className={styles.ghostBtn} onClick={resetForm}>
                  <X size={16} />
                  Anuluj edycje
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <h2>Filtry</h2>
          <div className={styles.filters}>
            <label>
              Category
              <input
                name='category'
                value={filters.category}
                onChange={handleFilterChange}
                placeholder='np. Food'
              />
            </label>
            <label>
              Difficulty level
              <input
                name='difficultyLevel'
                value={filters.difficultyLevel}
                onChange={handleFilterChange}
                placeholder='np. A1'
              />
            </label>
            <div className={styles.filterActions}>
              <button type='button' className={styles.primaryBtn} onClick={handleApplyFilters}>
                Zastosuj
              </button>
              <button type='button' className={styles.ghostBtn} onClick={handleClearFilters}>
                Wyczysc
              </button>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.listHeader}>
            <h2>Lista fiszek ({flashcards.length})</h2>
            <button type='button' className={styles.ghostBtn} onClick={() => loadFlashcards()}>
              Odswiez
            </button>
          </div>

          {loading && <p className={styles.info}>Ladowanie fiszek...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!loading && !error && flashcards.length === 0 && (
            <p className={styles.info}>Brak fiszek. Dodaj pierwsza fiszke formularzem powyzej.</p>
          )}

          {!loading && flashcards.length > 0 && (
            <div className={styles.cards}>
              {flashcards.map((card) => (
                <article key={card.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <h3>{card.englishWord}</h3>
                    <span>#{card.id}</span>
                  </div>
                  <p>
                    <strong>PL:</strong> {card.polishTranslation}
                  </p>
                  <p>
                    <strong>Przyklad:</strong> {card.exampleUsage}
                  </p>
                  <p>
                    <strong>Poziom:</strong> {card.difficultyLevel}
                  </p>
                  <p>
                    <strong>Kategoria:</strong> {card.category}
                  </p>
                  <div className={styles.cardActions}>
                    <button type='button' className={styles.ghostBtn} onClick={() => handleEdit(card)}>
                      <Pencil size={15} />
                      Edytuj
                    </button>
                    <button
                      type='button'
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(card.id)}
                    >
                      <Trash2 size={15} />
                      Usun
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
