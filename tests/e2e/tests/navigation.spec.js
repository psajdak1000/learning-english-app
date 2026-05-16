import { test, expect } from '@playwright/test';

/**
 * Testy E2E — Nawigacja między stronami.
 * Sprawdzają poprawność routingu SPA i nawigacji.
 */
test.describe('Nawigacja', () => {
  test('powinna nawigować ze strony głównej do logowania', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.locator('a[href="/login"]').first();
    await loginLink.click();

    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Zaloguj się')).toBeVisible();
  });

  test('powinna nawigować ze strony głównej do rejestracji', async ({ page }) => {
    await page.goto('/');

    const registerLink = page.locator('a[href="/register"]').first();
    await registerLink.click();

    await expect(page).toHaveURL('/register');
    await expect(page.getByText('Utwórz konto')).toBeVisible();
  });

  test('powinna nawigować z logowania do rejestracji', async ({ page }) => {
    await page.goto('/login');

    await page.getByText(/zarejestruj się za darmo/i).click();

    await expect(page).toHaveURL('/register');
    await expect(page.getByText('Utwórz konto')).toBeVisible();
  });

  test('powinna nawigować z rejestracji do logowania', async ({ page }) => {
    await page.goto('/register');

    await page.getByText(/zaloguj się/i).click();

    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Zaloguj się')).toBeVisible();
  });

  test('powinna obsługiwać nawigację wstecz przeglądarki', async ({ page }) => {
    await page.goto('/');
    await page.goto('/login');
    await page.goto('/register');

    await page.goBack();
    await expect(page).toHaveURL('/login');

    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('powinna renderować stronę fiszek', async ({ page }) => {
    await page.goto('/flashcards');

    await expect(page.getByText(/twoje fiszki/i)).toBeVisible();
  });

  test('powinna renderować placeholder quizów', async ({ page }) => {
    await page.goto('/quizzes');

    await expect(page.getByText(/quizy — wkrótce/i)).toBeVisible();
  });

  test('powinna renderować placeholder turniejów', async ({ page }) => {
    await page.goto('/tournaments');

    await expect(page.getByText(/turnieje — wkrótce/i)).toBeVisible();
  });

  test('powinna renderować placeholder AI Chat', async ({ page }) => {
    await page.goto('/ai-chat');

    await expect(page.getByText(/ai chat — wkrótce/i)).toBeVisible();
  });

  test('powinna renderować placeholder postępów', async ({ page }) => {
    await page.goto('/progress');

    await expect(page.getByText(/postępy — wkrótce/i)).toBeVisible();
  });

  test('pełny flow nawigacji: główna → login → register → główna', async ({ page }) => {
    // 1. Strona główna
    await page.goto('/');
    await expect(page.locator('nav').first()).toBeVisible();

    // 2. Przejdź do logowania
    await page.locator('a[href="/login"]').first().click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Zaloguj się')).toBeVisible();

    // 3. Przejdź do rejestracji
    await page.getByText(/zarejestruj się za darmo/i).click();
    await expect(page).toHaveURL('/register');
    await expect(page.getByText('Utwórz konto')).toBeVisible();

    // 4. Wróć na stronę główną
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});
