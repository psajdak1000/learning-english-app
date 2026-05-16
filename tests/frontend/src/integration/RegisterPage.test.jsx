import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from '@app/pages/RegisterPage';

/**
 * Testy integracyjne dla RegisterPage.
 * Sprawdzają walidację formularza rejestracji, wskaźnik siły hasła,
 * potwierdzenie hasła i akceptację regulaminu.
 */

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <RegisterPage />
    </MemoryRouter>
  );
}

describe('RegisterPage — testy integracyjne', () => {
  it('powinien renderować formularz rejestracji', () => {
    renderRegisterPage();

    expect(screen.getByText('Utwórz konto')).toBeInTheDocument();
    expect(screen.getByLabelText(/imię/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();
  });

  it('powinien wyświetlić wszystkie wymagane pola', () => {
    renderRegisterPage();

    expect(screen.getByPlaceholderText(/jak masz na imię/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/twoj@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min. 8 znaków/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/powtórz hasło/i)).toBeInTheDocument();
  });

  it('powinien wyświetlić błędy walidacji przy pustym formularzu', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', { name: /utwórz konto/i });
    await user.click(submitBtn);

    expect(screen.getByText(/imię jest wymagane/i)).toBeInTheDocument();
    expect(screen.getByText(/adres e-mail jest wymagany/i)).toBeInTheDocument();
    expect(screen.getByText(/hasło jest wymagane/i)).toBeInTheDocument();
  });

  it('powinien walidować minimalną długość hasła', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText(/jak masz na imię/i);
    const emailInput = screen.getByPlaceholderText(/twoj@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/min. 8 znaków/i);
    const confirmInput = screen.getByPlaceholderText(/powtórz hasło/i);

    await user.type(nameInput, 'Jan');
    await user.type(emailInput, 'jan@test.com');
    await user.type(passwordInput, 'short');
    await user.type(confirmInput, 'short');

    const submitBtn = screen.getByRole('button', { name: /utwórz konto/i });
    await user.click(submitBtn);

    expect(screen.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeInTheDocument();
  });

  it('powinien walidować zgodność haseł', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText(/jak masz na imię/i);
    const emailInput = screen.getByPlaceholderText(/twoj@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/min. 8 znaków/i);
    const confirmInput = screen.getByPlaceholderText(/powtórz hasło/i);

    await user.type(nameInput, 'Jan');
    await user.type(emailInput, 'jan@test.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmInput, 'DifferentPass');

    const submitBtn = screen.getByRole('button', { name: /utwórz konto/i });
    await user.click(submitBtn);

    expect(screen.getByText(/hasła nie są zgodne/i)).toBeInTheDocument();
  });

  it('powinien wymagać akceptacji regulaminu', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText(/jak masz na imię/i);
    const emailInput = screen.getByPlaceholderText(/twoj@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/min. 8 znaków/i);
    const confirmInput = screen.getByPlaceholderText(/powtórz hasło/i);

    await user.type(nameInput, 'Jan');
    await user.type(emailInput, 'jan@test.com');
    await user.type(passwordInput, 'Password123!');
    await user.type(confirmInput, 'Password123!');

    const submitBtn = screen.getByRole('button', { name: /utwórz konto/i });
    await user.click(submitBtn);

    expect(screen.getByText(/musisz zaakceptować regulamin/i)).toBeInTheDocument();
  });

  it('powinien wyświetlić wskaźnik siły hasła po wpisaniu', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/min. 8 znaków/i);
    await user.type(passwordInput, 'Password123!');

    expect(screen.getByText(/silne/i)).toBeInTheDocument();
  });

  it('powinien wyświetlić "Słabe" dla słabego hasła', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/min. 8 znaków/i);
    await user.type(passwordInput, 'abc');

    expect(screen.getByText(/słabe/i)).toBeInTheDocument();
  });

  it('powinien renderować link do logowania', () => {
    renderRegisterPage();

    const loginLink = screen.getByText(/zaloguj się/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('powinien przełączać widoczność hasła', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/min. 8 znaków/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Pierwszy przycisk "Pokaż hasło" (dla pola hasło)
    const toggleButtons = screen.getAllByLabelText(/pokaż hasło/i);
    await user.click(toggleButtons[0]);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('powinien walidować format emaila', async () => {
    renderRegisterPage();
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText(/twoj@email.com/i);
    await user.type(emailInput, 'invalid-email');

    const submitBtn = screen.getByRole('button', { name: /utwórz konto/i });
    await user.click(submitBtn);

    expect(screen.getByText(/podaj poprawny adres e-mail/i)).toBeInTheDocument();
  });
});
