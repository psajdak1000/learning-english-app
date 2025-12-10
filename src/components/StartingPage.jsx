import { useEffect } from 'react';
import './StartingPage.css';

export default function StartingPage({
  onLoginClick,
  onRegisterClick,
  onFlashcardsClick
}) {
  useEffect(() => {
    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent =
            target >= 1000
              ? (target / 1000).toFixed(0) + 'K+'
              : target + '%';
          clearInterval(timer);
        } else {
          element.textContent =
            current >= 1000
              ? (current / 1000).toFixed(1) + 'K+'
              : Math.floor(current) + '%';
        }
      }, 30);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = document.querySelectorAll('.stat-number');
          const targets = [10000, 5000, 95];
          numbers.forEach((num, index) => {
            animateCounter(num, targets[index]);
          });
          observer.disconnect();
        }
      });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  const learnMore = () => {
    document.querySelector('.categories')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const openQuizzes = () => {
    alert('Otwieranie modułu Quizy...');
  };

  const openChatbot = () => {
    alert('Otwieranie Chatbota AI...');
  };

  return (
    <div className="starting-page">
      <header className="header">
        <div className="logo">📚 English Master</div>
        <div className="header-actions">
          <button className="login-btn" onClick={onLoginClick}>
            Zaloguj się
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>Naucz się angielskiego w nowoczesny sposób</h1>
        <p>Interaktywne fiszki, quizy i rozmowy z AI - wszystko w jednym miejscu</p>
        <div className="cta-buttons">
          <button className="cta-primary" onClick={onRegisterClick}>
            Zacznij za darmo
          </button>
          <button className="cta-secondary" onClick={learnMore}>
            Dowiedz się więcej
          </button>
        </div>
      </section>

      <section className="categories">
        <h2>Wybierz sposób nauki</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">🗂️</div>
            <h3>Fiszki</h3>
            <p>
              Ucz się nowych słów i zwrotów z interaktywnymi fiszkami.
              System powtórek sprawi, że zapamiętasz więcej!
            </p>
            <button className="card-btn" onClick={onFlashcardsClick}>
              Rozpocznij
            </button>
          </div>

          <div className="card">
            <div className="card-icon">🎯</div>
            <h3>Quizy</h3>
            <p>
              Sprawdź swoją wiedzę w ciekawych quizach.
              Różne poziomy trudności dla każdego ucznia.
            </p>
            <button className="card-btn" onClick={openQuizzes}>
              Sprawdź się
            </button>
          </div>

          <div className="card">
            <div className="card-icon">🤖</div>
            <h3>Chatbot AI</h3>
            <p>
              Ćwicz konwersacje z inteligentnym chatbotem.
              Naturalne rozmowy 24/7 dopasowane do Twojego poziomu.
            </p>
            <button className="card-btn" onClick={openChatbot}>
              Rozmawiaj
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        {/* tu zostawiasz swoje feature-item tak jak miałeś */}
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Aktywnych użytkowników</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Słów w bazie</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Zadowolonych uczniów</div>
          </div>
        </div>
      </section>
    </div>
  );
}
