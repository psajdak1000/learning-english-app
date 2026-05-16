import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@app/hooks/useTheme';

/**
 * Testy jednostkowe dla hooka useTheme.
 * Sprawdzają inicjalizację motywu, przełączanie, zapis do localStorage
 * i synchronizację z preferencjami systemowymi.
 */
describe('useTheme — testy jednostkowe', () => {
  let matchMediaListeners = [];

  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();

    // Mock matchMedia
    matchMediaListeners = [];
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false, // domyślnie light mode
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, handler) => {
          matchMediaListeners.push(handler);
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock document.documentElement.setAttribute
    document.documentElement.setAttribute = vi.fn();
  });

  it('powinien zainicjalizować motyw jako "light" gdy system preferuje jasny', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('powinien zainicjalizować motyw jako "dark" gdy system preferuje ciemny', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true, // dark mode
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('powinien użyć zapisanego motywu z localStorage', () => {
    localStorage.setItem('fluent-theme', 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('powinien przełączać motyw z light na dark', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });

  it('powinien przełączać motyw z dark na light', () => {
    localStorage.setItem('fluent-theme', 'dark');

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('powinien zapisywać motyw do localStorage po przełączeniu', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('fluent-theme')).toBe('dark');
  });

  it('powinien ustawiać atrybut data-theme na document', () => {
    renderHook(() => useTheme());

    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'light'
    );
  });

  it('toggleTheme powinien być funkcją', () => {
    const { result } = renderHook(() => useTheme());

    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('powinien prawidłowo przełączać wielokrotnie', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme()); // -> dark
    act(() => result.current.toggleTheme()); // -> light
    act(() => result.current.toggleTheme()); // -> dark

    expect(result.current.theme).toBe('dark');
  });
});
