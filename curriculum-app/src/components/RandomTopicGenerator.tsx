import React, { useState } from 'react';

const TOPICS = [
  "Is AI making students lazier?",
  "Should college attendance be mandatory?",
  "Is a B.Com degree enough in 2026?",
  "Should companies ban remote work for entry-level roles?",
  "Are traditional resumes dead?",
  "Is social media a net positive for career growth?",
  "Should the gig economy replace traditional employment?",
  "Is the 4-day workweek viable in India?",
  "Are soft skills more important than technical skills?",
  "Should practical internships replace the final year of college?"
];

interface RandomTopicGeneratorProps {
  customTopics?: string[];
  mode?: "debate" | "pronunciation";
}

export default function RandomTopicGenerator({ customTopics, mode = "debate" }: RandomTopicGeneratorProps = {}) {
  const [currentTopic, setCurrentTopic] = useState("Click 'Spin' to Generate a Topic");
  const [isSpinning, setIsSpinning] = useState(false);

  
  const playPronunciation = () => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(currentTopic);
    utterance.lang = 'en-IN'; // Indian English pronunciation like in screenshot
    window.speechSynthesis.speak(utterance);
  };

  const activeTopics = customTopics && customTopics.length > 0 && customTopics[0] !== 'spin' ? customTopics : TOPICS;

  const spinTopic = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    let spins = 0;
    const maxSpins = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * activeTopics.length);
      setCurrentTopic(activeTopics[randomIndex]);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      background: 'rgba(30, 41, 59, 0.7)',
      borderRadius: '24px',
      border: '2px solid rgba(148, 163, 184, 0.2)',
      margin: '2rem auto',
      textAlign: 'center',
      width: '100%',
      maxWidth: '800px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <h3 style={{ 
          fontSize: currentTopic.length > 50 ? '2rem' : (currentTopic.length > 35 ? '2.5rem' : '3rem'), 
          fontWeight: 800, 
          color: isSpinning ? '#cbd5e1' : '#38bdf8',
          marginBottom: '3rem',
          lineHeight: 1.3,
          transition: 'color 0.3s ease',
          textShadow: isSpinning ? 'none' : '0 0 20px rgba(56, 189, 248, 0.4)',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          padding: '0 1rem'
        }}>
          {currentTopic}
        </h3>
      </div>
      
      <button 
        onClick={spinTopic}
        disabled={isSpinning}
        style={{
          background: isSpinning ? '#475569' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          border: 'none',
          padding: '1rem 3rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          borderRadius: '50px',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          boxShadow: isSpinning ? 'none' : '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
          transition: 'all 0.2s ease',
          transform: isSpinning ? 'scale(0.95)' : 'scale(1)'
        }}
        onMouseOver={(e) => { if (!isSpinning) e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseOut={(e) => { if (!isSpinning) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isSpinning ? 'Selecting...' : 'Spin the Wheel'}
      </button>
      {mode === "debate" ? (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span style={{ color: '#ef4444' }}>FOR</span>
          <span>VS</span>
          <span style={{ color: '#22c55e' }}>AGAINST</span>
        </div>
      ) : (
        <button 
          onClick={playPronunciation}
          disabled={isSpinning || currentTopic.includes("Click")}
          style={{
            marginTop: '1.5rem',
            background: 'white',
            color: '#1f2937',
            border: '2px solid #e5e7eb',
            padding: '0.75rem 2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: (isSpinning || currentTopic.includes("Click")) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            opacity: (isSpinning || currentTopic.includes("Click")) ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { if (!isSpinning && !currentTopic.includes("Click")) e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { if (!isSpinning && !currentTopic.includes("Click")) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          Pronounce Word
        </button>
      )}
    </div>
  );
}
