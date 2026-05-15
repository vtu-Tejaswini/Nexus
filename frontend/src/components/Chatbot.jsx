import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const endOfMessagesRef = useRef(null);

  // Clear messages when user logs in/out or changes
  useEffect(() => {
    if (user) {
      setMessages([{ sender: 'bot', text: `Hi ${user.name}! I am your Campus Assistant. How can I help you today?` }]);
    } else {
      setMessages([{ sender: 'bot', text: 'Hi! I am the Campus Assistant. Please log in to get personalized help.' }]);
    }
  }, [user]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const pageContext = location.pathname;
      const res = await api.post('/chat', { query: input, pageContext });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Connection to Assistant lost...' }]);
    }
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '✨'}
      </button>

      {isOpen && (
        <div className="chatbot-widget card">
          <div className="chatbot-header">
            <span>Campus Assistant</span>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
            />
            <button type="submit">►</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
