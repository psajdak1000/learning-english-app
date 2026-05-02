import { Navbar } from '../StartingPage/Navbar/Navbar';
import styles from './AppShell.module.css';

/**
 * Layout wrapper for all authenticated / app pages.
 * Renders the Navbar and a padded main content area.
 *
 * @param {{ theme: string, toggleTheme: () => void, children: React.ReactNode }} props
 */
export function AppShell({ theme, toggleTheme, children }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className={styles.main}>{children}</main>
    </>
  );
}
