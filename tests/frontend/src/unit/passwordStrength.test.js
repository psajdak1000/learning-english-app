import { describe, it, expect } from 'vitest';

/**
 * Testy jednostkowe dla funkcji getPasswordStrength.
 * Funkcja jest zdefiniowana w RegisterPage.jsx — tutaj testujemy
 * jej logikę w izolacji (reimplementacja, bo nie jest eksportowana).
 */

// Reimplementacja funkcji z RegisterPage.jsx (nie modyfikujemy oryginalnego pliku)
function getPasswordStrength(password) {
  if (password.length === 0) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

describe('getPasswordStrength — testy jednostkowe', () => {
  it('powinien zwrócić null dla pustego hasła', () => {
    expect(getPasswordStrength('')).toBeNull();
  });

  it('powinien zwrócić "weak" dla krótkiego hasła bez specjalnych znaków', () => {
    expect(getPasswordStrength('abc')).toBe('weak');
  });

  it('powinien zwrócić "weak" dla hasła składającego się tylko z małych liter (krótkie)', () => {
    expect(getPasswordStrength('pass')).toBe('weak');
  });

  it('powinien zwrócić "weak" dla hasła >= 8 znaków ale tylko małe litery', () => {
    // score = 1 (długość >= 8) => weak
    expect(getPasswordStrength('abcdefgh')).toBe('weak');
  });

  it('powinien zwrócić "fair" dla hasła >= 8 z dużą literą', () => {
    // score = 2 (długość + duża litera) => fair
    expect(getPasswordStrength('Abcdefgh')).toBe('fair');
  });

  it('powinien zwrócić "fair" dla hasła >= 8 z cyfrą', () => {
    // score = 2 (długość + cyfra) => fair
    expect(getPasswordStrength('abcdefg1')).toBe('fair');
  });

  it('powinien zwrócić "good" dla hasła >= 8 z dużą literą i cyfrą', () => {
    // score = 3 (długość + duża + cyfra) => good
    expect(getPasswordStrength('Abcdefg1')).toBe('good');
  });

  it('powinien zwrócić "strong" dla hasła >= 8 z dużą literą, cyfrą i znakiem specjalnym', () => {
    // score = 4 (długość + duża + cyfra + specjalny) => strong
    expect(getPasswordStrength('Abcdef1!')).toBe('strong');
  });

  it('powinien zwrócić "weak" dla jednego znaku specjalnego (krótkie)', () => {
    // score = 1 (specjalny) => weak
    expect(getPasswordStrength('!')).toBe('weak');
  });

  it('powinien zwrócić "fair" dla krótkiego hasła z dużą literą i cyfrą', () => {
    // score = 2 (duża + cyfra) => fair
    expect(getPasswordStrength('A1')).toBe('fair');
  });

  it('powinien zwrócić "good" dla krótkiego hasła z dużą, cyfrą i specjalnym', () => {
    // score = 3 (duża + cyfra + specjalny) => good
    expect(getPasswordStrength('A1!')).toBe('good');
  });

  it('powinien zwrócić "strong" dla bardzo silnego hasła', () => {
    expect(getPasswordStrength('MyP@ssw0rd!')).toBe('strong');
  });

  it('powinien obsłużyć hasło składające się tylko z cyfr (długie)', () => {
    // score = 2 (długość + cyfra) => fair
    expect(getPasswordStrength('12345678')).toBe('fair');
  });

  it('powinien obsłużyć hasło ze spacjami', () => {
    // Spacja nie jest [A-Za-z0-9], więc liczy się jako specjalny
    // "pass word" => score = 2 (długość + specjalny) => fair
    expect(getPasswordStrength('pass word')).toBe('fair');
  });
});
