import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '@app/pages/LoginPage';

/**
 * Testy integracyjne dla LoginPage.
 * Renderują pełny komponent z routerem i sprawdzają
 * walidację formularza, interakcje użytkownika i nawigację.
 */

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage — testy integracyjne', () => {
  it('powinien renderować formularz logowania', () => {
    renderLoginPage();

    expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
  });

  it('powinien renderować przycisk submit', () => {
    renderLoginPage();

    const submitBtn = screen.getByRole('button', { name: /zaloguj się/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it('powinien wyświetlić błąd walidacji gdy email jest pusty', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const submitBtn = screen.getByRole('button', { name: /zaloguj się/i });
    await user.click(submitBtn);

    expect(screen.getByText(/adres e-mail jest wymagany/i)).toBeInTheDocument();
  });

  it('powinien wyświetlić błąd walidacji gdy email jest nieprawidłowy', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/adres e-mail/i);
    await user.type(emailInput, 'not-an-email');

    const submitBtn = screen.getByRole('button', { name: /zaloguj się/i });
    await user.click(submitBtn);

    expect(screen.getByText(/podaj poprawny adres e-mail/i)).toBeInTheDocument();
  });

  it('powinien wyświetlić błąd walidacji gdy hasło jest puste', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/adres e-mail/i);
    await user.type(emailInput, 'test@example.com');

    const submitBtn = screen.getByRole('button', { name: /zaloguj się/i });
    await user.click(submitBtn);

    expect(screen.getByText(/hasło jest wymagane/i)).toBeInTheDocument();
  });

  it('powinien przełączać widoczność hasła', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/pokaż hasło/i);
    await user.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('powinien aktualizować wartości formularza przy wpisywaniu', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/adres e-mail/i);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'mypassword');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('mypassword');
  });

  it('powinien renderować link do rejestracji', () => {
    renderLoginPage();

    const registerLink = screen.getByText(/zarejestruj się za darmo/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('powinien renderować link "Nie pamiętasz hasła?"', () => {
    renderLoginPage();

    const forgotLink = screen.getByText(/nie pamiętasz hasła/i);
    expect(forgotLink).toBeInTheDocument();
  });

  it('powinien renderować checkbox "Zapamiętaj mnie"', () => {
    renderLoginPage();

    expect(screen.getByText(/zapamiętaj mnie/i)).toBeInTheDocument();
  });

  it('powinien usunąć błąd walidacji po wpisaniu tekstu', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    // Wywołaj błąd
    const submitBtn = screen.getByRole('button', { name: /zaloguj się/i });
    await user.click(submitBtn);
    expect(screen.getByText(/adres e-mail jest wymagany/i)).toBeInTheDocument();

    // Wpisz tekst — błąd powinien zniknąć
    const emailInput = screen.getByLabelText(/adres e-mail/i);
    await user.type(emailInput, 'a');

    expect(screen.queryByText(/adres e-mail jest wymagany/i)).not.toBeInTheDocument();
  });
});
