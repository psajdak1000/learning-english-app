import { test, expect } from '@playwright/test';

/**
 * Testy E2E — Strona rejestracji.
 * Sprawdzają formularz rejestracji, walidację, wskaźnik siły hasła.
 */
test.describe('Strona rejestracji', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('powinna wyświetlić formularz rejestracji', async ({ page }) => {
    await expect(page.getByText('Utwórz konto')).toBeVisible();
    await expect(page.locator('#reg-name')).toBeVisible();
    await expect(page.locator('#reg-email')).toBeVisible();
    await expect(page.locator('#reg-password')).toBeVisible();
    await expect(page.locator('#reg-confirm')).toBeVisible();
  });

  test('powinna wyświetlić błędy walidacji dla pustego formularza', async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/imię jest wymagane/i)).toBeVisible();
    await expect(page.getByText(/adres e-mail jest wymagany/i)).toBeVisible();
    await expect(page.getByText(/hasło jest wymagane/i)).toBeVisible();
  });

  test('powinna walidować minimalną długość hasła', async ({ page }) => {
    await page.locator('#reg-name').fill('Jan');
    await page.locator('#reg-email').fill('jan@test.com');
    await page.locator('#reg-password').fill('short');
    await page.locator('#reg-confirm').fill('short');

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeVisible();
  });

  test('powinna walidować zgodność haseł', async ({ page }) => {
    await page.locator('#reg-name').fill('Jan');
    await page.locator('#reg-email').fill('jan@test.com');
    await page.locator('#reg-password').fill('Password123!');
    await page.locator('#reg-confirm').fill('DifferentPass!');

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/hasła nie są zgodne/i)).toBeVisible();
  });

  test('powinna wymagać akceptacji regulaminu', async ({ page }) => {
    await page.locator('#reg-name').fill('Jan');
    await page.locator('#reg-email').fill('jan@test.com');
    await page.locator('#reg-password').fill('Password123!');
    await page.locator('#reg-confirm').fill('Password123!');

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/musisz zaakceptować regulamin/i)).toBeVisible();
  });

  test('powinna wyświetlić wskaźnik siły hasła — Słabe', async ({ page }) => {
    await page.locator('#reg-password').fill('abc');

    await expect(page.getByText(/słabe/i)).toBeVisible();
  });

  test('powinna wyświetlić wskaźnik siły hasła — Silne', async ({ page }) => {
    await page.locator('#reg-password').fill('Password123!');

    await expect(page.getByText(/silne/i)).toBeVisible();
  });

  test('powinna walidować format emaila', async ({ page }) => {
    await page.locator('#reg-email').fill('not-an-email');

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/podaj poprawny adres e-mail/i)).toBeVisible();
  });

  test('powinna przełączać widoczność hasła', async ({ page }) => {
    const passwordInput = page.locator('#reg-password');
    await passwordInput.fill('secret');

    await expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButtons = page.getByLabel(/pokaż hasło/i);
    await toggleButtons.first().click();

    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('powinna nawigować do logowania po kliknięciu linku', async ({ page }) => {
    await page.getByText(/zaloguj się/i).click();
    await expect(page).toHaveURL('/login');
  });

  test('powinna pozwalać na wypełnienie całego formularza', async ({ page }) => {
    await page.locator('#reg-name').fill('Jan Kowalski');
    await page.locator('#reg-email').fill('jan@example.com');
    await page.locator('#reg-password').fill('Password123!');
    await page.locator('#reg-confirm').fill('Password123!');
    await page.locator('input[name="terms"]').check();

    // Sprawdzamy wartości
    await expect(page.locator('#reg-name')).toHaveValue('Jan Kowalski');
    await expect(page.locator('#reg-email')).toHaveValue('jan@example.com');
    await expect(page.locator('#reg-password')).toHaveValue('Password123!');
    await expect(page.locator('#reg-confirm')).toHaveValue('Password123!');
    await expect(page.locator('input[name="terms"]')).toBeChecked();
  });
});
