import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell';
import { useTheme } from './hooks/useTheme';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { BotPage } from './pages/BotPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizPage } from './pages/QuizPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResultsPage } from './pages/ResultsPage';
import { StudyPage } from './pages/StudyPage';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const shell = (children) => (
    <AppShell theme={theme} toggleTheme={toggleTheme}>
      {children}
    </AppShell>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/flashcards' element={shell(<FlashcardsPage />)} />
        <Route path='/flashcards/:deckId/study' element={shell(<StudyPage />)} />
        <Route path='/quizzes' element={shell(<QuizPage />)} />
        <Route
          path='/tournaments'
          element={shell(<div style={{ padding: '4rem 2rem' }}>Turnieje - wkrotce</div>)}
        />
        <Route
          path='/ai-chat'
          element={shell(<BotPage />)}
        />
        <Route path='/progress' element={shell(<ProgressPage />)} />
        <Route path='/results' element={shell(<ResultsPage />)} />
      </Routes>
    </BrowserRouter>
  );
}
