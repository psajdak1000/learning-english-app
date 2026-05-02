import { Navbar } from '../components/StartingPage/Navbar/Navbar';
import { Hero } from '../components/StartingPage/Hero/Hero';
import { Features } from '../components/StartingPage/Features/Features';
import { HowItWorks } from '../components/StartingPage/HowItWorks/HowItWorks';
import { CallToAction } from '../components/StartingPage/CallToAction/CallToAction';
import { Footer } from '../components/StartingPage/Footer/Footer';

/** @param {{ theme: string, toggleTheme: () => void }} props */
export function HomePage({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
