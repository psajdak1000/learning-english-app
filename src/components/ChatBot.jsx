import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatBot.css'; // Zaraz stworzymy ten styl

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Automatyczne przewijanie do dołu
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Strzał do Twojego Spring Boota
            const response = await fetch('http://localhost:8080/api/bot/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage.text }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages((prev) => [...prev, { text: data.answer, sender: 'bot' }]);
            } else {
                setMessages((prev) => [...prev, { text: "Błąd serwera. Czy backend działa?", sender: 'bot' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { text: "Błąd połączenia z API.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>🤖 AI English Tutor</h2>
                <button onClick={() => navigate('/')} className="back-btn">Wróć</button>
            </div>

            <div className="messages-area">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <p>Hi! I'm your English teacher.</p>
                        <p>Ask me about grammar, vocabulary, or just chat!</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                        <div className="bubble">{msg.text}</div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message bot-msg">
                        <div className="bubble typing">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type something in English..."
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    Send ➤
                </button>
            </div>
        </div>
    );
}