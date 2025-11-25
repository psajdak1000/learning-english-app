import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. Importujemy BrowserRouter
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* 2. Otaczamy całą aplikację <App /> w <BrowserRouter> */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)