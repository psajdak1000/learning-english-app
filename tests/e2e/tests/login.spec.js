import { test, expect } from '@playwright/test';

/**
 * Testy E2E — Strona logowania.
 * Sprawdzają formularz logowania, walidację i interakcje użytkownika.
 */
test.describe('Strona logowania', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('powinna wyświetlić formularz logowania', async ({ page }) => {
    await expect(page.getByText('Zaloguj się')).toBeVisible();
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
  });

  test('powinna wyświetlić przycisk submit', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('powinna wyświetlić błędy walidacji dla pustego formularza', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await expect(page.getByText(/adres e-mail jest wymagany/i)).toBeVisible();
    await expect(page.getByText(/hasło jest wymagane/i)).toBeVisible();
  });

  test('powinna walidować format emaila', async ({ page }) => {
    await page.locator('#login-email').fill('invalid-email');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/podaj poprawny adres e-mail/i)).toBeVisible();
  });

  test('powinna pozwalać na wpisywanie danych', async ({ page }) => {
    await page.locator('#login-email').fill('test@example.com');
    await page.locator('#login-password').fill('mypassword123');

    await expect(page.locator('#login-email')).toHaveValue('test@example.com');
    await expect(page.locator('#login-password')).toHaveValue('mypassword123');
  });

  test('powinna przełączać widoczność hasła', async ({ page }) => {
    const passwordInput = page.locator('#login-password');
    await passwordInput.fill('secret');

    // Domyślnie hasło jest ukryte
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Kliknij przycisk "Pokaż hasło"
    const toggleBtn = page.getByLabel(/pokaż hasło/i);
    await toggleBtn.click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Kliknij ponownie — hasło powinno być ukryte
    await page.getByLabel(/ukryj hasło/i).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('powinna mieć link do rejestracji', async ({ page }) => {
    const registerLink = page.getByText(/zarejestruj się za darmo/i);
    await expect(registerLink).toBeVisible();
  });

  test('powinna nawigować do rejestracji po kliknięciu linku', async ({ page }) => {
    await page.getByText(/zarejestruj się za darmo/i).click();
    await expect(page).toHaveURL('/register');
  });

  test('powinna mieć link "Nie pamiętasz hasła?"', async ({ page }) => {
    const forgotLink = page.getByText(/nie pamiętasz hasła/i);
    await expect(forgotLink).toBeVisible();
  });

  test('powinna mieć checkbox "Zapamiętaj mnie"', async ({ page }) => {
    const checkbox = page.locator('input[name="remember"]');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();

    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('powinna usuwać błędy walidacji po wpisaniu tekstu', async ({ page }) => {
    // Wywołaj błąd
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/adres e-mail jest wymagany/i)).toBeVisible();

    // Wpisz coś — błąd powinien zniknąć
    await page.locator('#login-email').fill('a');
    await expect(page.getByText(/adres e-mail jest wymagany/i)).not.toBeVisible();
  });
});
