import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = ({ highContrast, onTriggerSimulation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your FraudShield Assistant. How can I help you monitor transactions today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/chatbot', { query: userMsg });
      const data = res.data;
      
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
      
      if (data.triggerSimulation) {
        onTriggerSimulation({ 
          batchSize: data.triggerSimulation.count, 
          scenario: data.triggerSimulation.scenario 
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { text: "I'm sorry, I'm having trouble connecting to my brain right now.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const bubbleBg = highContrast ? 'white' : '#10b981';
  const bubbleColor = highContrast ? 'black' : 'white';
  const chatBg = highContrast ? 'black' : 'rgba(30, 41, 59, 0.95)';
  const borderColor = highContrast ? 'white' : 'rgba(0, 243, 255, 0.3)';

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10001 }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '350px',
          height: '500px',
          backgroundColor: chatBg,
          backdropFilter: highContrast ? 'none' : 'blur(20px)',
          borderRadius: '1.5rem',
          border: `1px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: highContrast ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 243, 255, 0.1)',
          marginBottom: '1rem',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '1.25rem', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: highContrast ? 'white' : 'rgba(16, 185, 129, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
              <span style={{ fontWeight: 'bold', color: highContrast ? 'black' : 'white' }}>FraudShield AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: highContrast ? 'black' : '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.isBot ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                padding: '0.75rem 1rem',
                borderRadius: m.isBot ? '1rem 1rem 1rem 0' : '1rem 1rem 0 1rem',
                backgroundColor: m.isBot ? (highContrast ? '#333' : 'rgba(15, 23, 42, 0.6)') : (highContrast ? 'white' : '#10b981'),
                color: m.isBot ? 'white' : (highContrast ? 'black' : 'white'),
                fontSize: '0.9rem',
                lineHeight: '1.4',
                border: m.isBot ? `1px solid ${borderColor}` : 'none'
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>AI is thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: `1px solid ${borderColor}`, display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: highContrast ? 'black' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${borderColor}`,
                borderRadius: '0.75rem',
                color: 'white',
                outline: 'none',
                fontSize: '0.875rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem',
                backgroundColor: highContrast ? 'white' : '#10b981',
                color: highContrast ? 'black' : 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Toggle Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-glow"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: bubbleBg,
          color: bubbleColor,
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: highContrast ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 0 20px rgba(16, 185, 129, 0.4)',
          transition: 'all 0.3s'
        }}
      >
        {isOpen ? '↓' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;
