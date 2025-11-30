import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import StartingPage from './components/StartingPage';
import FlashcardsView from './components/FlashcardsView';

function App() {
  const [showStartAnimation, setShowStartAnimation] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStartAnimation(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowFlashcards(false);
  };
  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowFlashcards(false);
  };
  const handleFlashcardsClick = () => {
    setShowFlashcards(true);
    setShowLogin(false);
    setShowRegister(false);
  };
  const handleBackToHome = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowFlashcards(false);
  };

  return (
    <>
      <AnimatePresence>
        {showStartAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.65 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#181818',
              zIndex: 9999
            }}
          >
            <div style={{ textAlign: 'center', color: '#fafafa' }}>
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1, 1.13, 1], opacity: [0, 1, 0.98, 1] }}
                transition={{ duration: 0.9, delay: 0.2 }}
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1.1rem',
                  letterSpacing: '0.08em',
                  textShadow: '0 3px 14px #000'
                }}
              >
                English Master
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={{
                  fontSize: '1.33rem',
                  color: '#d32f2f',
                  marginBottom: '2rem',
                  textShadow: '0 2px 8px #600'
                }}
              >
                Ucz się angielskiego w nowoczesnym stylu
              </motion.p>
              <motion.div
                animate={{
                  scale: [1, 1.29, 1],
                  rotate: [0, -12, 12, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  marginTop: '2.5rem',
                  fontSize: '4rem',
                  filter: 'drop-shadow(0 0 12px #d32f2f88)'
                }}
              >
                🔥
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showStartAnimation && (
        showLogin
          ? <Login onLogin={() => {}} onBackToHome={handleBackToHome} onRegisterClick={handleRegisterClick}/>
          : showRegister
            ? <Register onRegister={() => {}} onBackToHome={handleBackToHome} onBackToLogin={handleLoginClick}/>
            : showFlashcards
              ? <FlashcardsView onBack={handleBackToHome} />
              : <StartingPage
                  onLoginClick={handleLoginClick}
                  onRegisterClick={handleRegisterClick}
                  onFlashcardsClick={handleFlashcardsClick}
                />
      )}
    </>
  );
}

export default App;
