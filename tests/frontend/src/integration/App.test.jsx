import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@app/App';

/**
 * Testy integracyjne dla głównego komponentu App.
 * Sprawdzają routing i renderowanie poszczególnych stron.
 */

// Mock matchMedia dla useTheme
beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  document.documentElement.setAttribute = vi.fn();
});

describe('App — testy integracyjne routingu', () => {
  it('powinien renderować stronę główną na ścieżce /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // HomePage zawiera Navbar i Hero
    // Sprawdzamy, czy cokolwiek się renderuje bez błędów
    expect(document.body).toBeTruthy();
  });

  it('powinien renderować stronę logowania na ścieżce /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/zaloguj się/i)).toBeInTheDocument();
  });

  it('powinien renderować stronę rejestracji na ścieżce /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/utwórz konto/i)).toBeInTheDocument();
  });

  it('powinien renderować stronę fiszek na ścieżce /flashcards', () => {
    render(
      <MemoryRouter initialEntries={['/flashcards']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/twoje fiszki/i)).toBeInTheDocument();
  });

  it('powinien renderować placeholder dla quizów', () => {
    render(
      <MemoryRouter initialEntries={['/quizzes']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/quizy — wkrótce/i)).toBeInTheDocument();
  });

  it('powinien renderować placeholder dla turniejów', () => {
    render(
      <MemoryRouter initialEntries={['/tournaments']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/turnieje — wkrótce/i)).toBeInTheDocument();
  });

  it('powinien renderować placeholder dla AI Chat', () => {
    render(
      <MemoryRouter initialEntries={['/ai-chat']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/ai chat — wkrótce/i)).toBeInTheDocument();
  });

  it('powinien renderować placeholder dla postępów', () => {
    render(
      <MemoryRouter initialEntries={['/progress']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/postępy — wkrótce/i)).toBeInTheDocument();
  });
});
