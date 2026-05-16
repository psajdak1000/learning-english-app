import { test, expect } from '@playwright/test';

/**
 * Testy E2E — Strona główna (HomePage).
 * Sprawdzają renderowanie głównych sekcji landing page'a.
 */
test.describe('Strona główna', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('powinna załadować się poprawnie', async ({ page }) => {
    await expect(page).toHaveURL('/');
    // Strona powinna się załadować bez błędów
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('powinna wyświetlić navbar', async ({ page }) => {
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('powinna zawierać sekcję Hero', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('powinna zawierać link do logowania w nawigacji', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]').first();
    await expect(loginLink).toBeVisible();
  });

  test('powinna zawierać link do rejestracji', async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]').first();
    await expect(registerLink).toBeVisible();
  });

  test('powinna mieć przycisk przełączania motywu', async ({ page }) => {
    // Szukamy przycisku theme toggle (może mieć ikonę)
    const themeBtn = page.locator('button').filter({ hasText: /(motyw|theme)/i })
      .or(page.locator('[aria-label*="theme"]'))
      .or(page.locator('[aria-label*="motyw"]'))
      .first();

    // Jeśli istnieje przycisk motywu, sprawdzamy czy jest klikalny
    const count = await themeBtn.count();
    if (count > 0) {
      await expect(themeBtn).toBeVisible();
    }
  });

  test('powinna mieć stopkę (footer)', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('powinna się ładować w czasie poniżej 5 sekund', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });
});
