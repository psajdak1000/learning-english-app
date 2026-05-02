import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { AppShell } from './components/AppShell/AppShell';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
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
        {/* Future routes mount here */}
        <Route path='/quizzes' element={shell(<div style={{ padding: '4rem 2rem' }}>Quizy — wkrótce</div>)} />
        <Route path='/tournaments' element={shell(<div style={{ padding: '4rem 2rem' }}>Turnieje — wkrótce</div>)} />
        <Route path='/ai-chat' element={shell(<div style={{ padding: '4rem 2rem' }}>AI Chat — wkrótce</div>)} />
        <Route path='/progress' element={shell(<div style={{ padding: '4rem 2rem' }}>Postępy — wkrótce</div>)} />
      </Routes>
    </BrowserRouter>
  );
}
