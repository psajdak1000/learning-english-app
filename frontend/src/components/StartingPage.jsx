import { useEffect } from 'react';
import './StartingPage.css';

export default function StartingPage({ onLoginClick }) {
  useEffect(() => {
    // Animacja liczników
    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target >= 1000
            ? (target/1000).toFixed(0) + 'K+'
            : target + '%';
          clearInterval(timer);

        } else {
          element.textContent = current >= 1000
            ? (current/1000).toFixed(1) + 'K+'
            : Math.floor(current) + '%';
        }
      }, 30);
    };

    const observer = new IntersectionObserver((entries) => {
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

  const goToLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const startLearning = () => {
    alert('Rozpoczynamy naukę! 🚀');
  };

  const learnMore = () => {
    document.querySelector('.categories')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const openFlashcards = () => {
    alert('Otwieranie modułu Fiszki...');
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
        <div className="logo">
          📚 English Master
        </div>
        <div className="header-actions">
        <button className="login-btn" onClick={goToLogin}>
          Zaloguj się
        </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Naucz się angielskiego w nowoczesny sposób</h1>
        <p>Interaktywne fiszki, quizy i rozmowy z AI - wszystko w jednym miejscu</p>
        <div className="cta-buttons">
          <button className="cta-primary" onClick={startLearning}>
            Zacznij za darmo
          </button>
          <button className="cta-secondary" onClick={learnMore}>
            Dowiedz się więcej
          </button>
        </div>
      </section>

      {/* Categories Section */}
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
            <button className="card-btn" onClick={openFlashcards}>
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

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2>Dlaczego English Master?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Szybka nauka</h4>
              <p>Zaawansowane algorytmy powtórek przyspieszają proces zapamiętywania</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h4>Dostępność</h4>
              <p>Ucz się kiedy chcesz i gdzie chcesz - w przeglądarce lub aplikacji</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h4>Przyjazny interfejs</h4>
              <p>Nowoczesny i intuicyjny design sprawia, że nauka jest przyjemnością</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Statystyki</h4>
              <p>Śledź swoje postępy i zobacz jak się rozwijasz każdego dnia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
