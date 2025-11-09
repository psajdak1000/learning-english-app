import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import StartingPage from './components/StartingPage';


function App() {
  const [showStartAnimation, setShowStartAnimation] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Animacja znika po 3 sekundach
    const timer = setTimeout(() => setShowStartAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleBackToHome = () => {
    setShowLogin(false);
  };

  const handleLogin = (credentials) => {
    console.log('Logowanie:', credentials);
    // Tu dodasz logikę logowania
  };

  return (
    <>
      {/* Animacja startowa */}
      <AnimatePresence>
        {showStartAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              zIndex: 9999
            }}
          >
            <div style={{ textAlign: 'center', color: 'white' }}>
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ 
                  fontSize: '3.5rem', 
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                English Master
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ 
                  fontSize: '1.4rem',
                  opacity: 0.9
                }}
              >
                Ucz się angielskiego w nowoczesny sposób
              </motion.p>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ 
                  marginTop: '2rem',
                  fontSize: '4rem'
                }}
              >
                📚
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Po animacji pokazujemy stronę startową lub logowanie */}
      {!showStartAnimation && (
        showLogin 
          ? <Login onLogin={handleLogin} onBackToHome={handleBackToHome} /> 
          : <StartingPage onLoginClick={handleLoginClick} />
      )}
    </>
  );
}

export default App;
