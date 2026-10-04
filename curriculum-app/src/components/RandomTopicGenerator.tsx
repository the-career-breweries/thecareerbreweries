import React, { useState, useEffect } from 'react';

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

const PHONETICS: Record<string, string> = {
  "Entrepreneur": "ahn·truh·pruh·nur",
  "Rendezvous": "ron·day·voo",
  "Itinerary": "ai·ti·nuh·reh·ree",
  "Faux pas": "foe pah",
  "Quinoa": "keen·waa",
  "Mischievous": "mis·chuh·vus",
  "Epitome": "uh·pi·tuh·mee",
  "Colonel": "kur·nl",
  "Draught": "draft",
  "Hyperbole": "hai·pur·buh·lee",
  "Cache": "kash",
  "Almond": "aa·mund",
  "Aisle": "ail",
  "Asthma": "az·muh",
  "Boutique": "boo·teek",
  "Chassis": "cha·see",
  "Facade": "fuh·saad",
  "Gauge": "gayj",
  "Hierarchy": "hai·ruh·raa·kee",
  "Lingerie": "laan·zhuh·ray",
  "Niche": "neesh",
  "Queue": "kyoo",
  "Suite": "sweet",
  "Yacht": "yaat"
};

interface RandomTopicGeneratorProps {
  customTopics?: string[];
  mode?: "debate" | "pronunciation";
}

export default function RandomTopicGenerator({ customTopics, mode = "debate" }: RandomTopicGeneratorProps = {}) {
  const [currentTopic, setCurrentTopic] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinComplete, setSpinComplete] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // States for voice and speed
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoiceURI) {
          // Default to an Indian English voice if available, else standard UK or US
          const defaultVoice = availableVoices.find(v => v.lang === 'en-IN') || availableVoices.find(v => v.lang === 'en-GB') || availableVoices[0];
          if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI]);
  
  const playPronunciation = () => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(currentTopic);
    
    if (selectedVoiceURI) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
    } else {
      utterance.lang = 'en-IN'; 
    }
    
    utterance.rate = isSlowMode ? 0.5 : 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const activeTopics = customTopics && customTopics.length > 0 && customTopics[0] !== 'spin' ? customTopics : TOPICS;

  const spinTopic = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinComplete(false);
    setShowCard(false);
    
    let spins = 0;
    const maxSpins = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * activeTopics.length);
      setCurrentTopic(activeTopics[randomIndex]);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        setSpinComplete(true);
      }
    }, 100);
  };

  const handlePronounceClick = () => {
    setShowCard(true);
    // Play immediately when the card is shown
    setTimeout(() => {
      playPronunciation();
    }, 100);
  };

  const phonetic = PHONETICS[currentTopic] || currentTopic.toLowerCase();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem',
      background: mode === 'debate' ? 'rgba(30, 41, 59, 0.7)' : 'transparent',
      borderRadius: '24px',
      margin: '1rem auto',
      width: '100%',
      maxWidth: '800px',
      minHeight: '400px'
    }}>
      
      {/* Spin Button - Always present at the top */}
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
          transform: isSpinning ? 'scale(0.95)' : 'scale(1)',
          marginBottom: '2rem'
        }}
        onMouseOver={(e) => { if (!isSpinning) e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseOut={(e) => { if (!isSpinning) e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {/* Mode Debate Render */}
      {mode === "debate" && (
        <>
          <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ 
              fontSize: (!currentTopic || currentTopic.length > 50) ? '2rem' : (currentTopic.length > 35 ? '2.5rem' : '3rem'), 
              fontWeight: 800, 
              color: isSpinning ? '#cbd5e1' : '#38bdf8',
              lineHeight: 1.3,
              textShadow: isSpinning ? 'none' : '0 0 20px rgba(56, 189, 248, 0.4)',
              textAlign: 'center'
            }}>
              {currentTopic || "Click 'Spin' to Generate a Topic"}
            </h3>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span style={{ color: '#ef4444' }}>FOR</span>
            <span>VS</span>
            <span style={{ color: '#22c55e' }}>AGAINST</span>
          </div>
        </>
      )}

      {/* Mode Pronunciation Render */}
      {mode === "pronunciation" && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '200px' }}>
          
          {/* Phase: Spinning or Just Completed (No Card Yet) */}
          {(!showCard && (isSpinning || spinComplete)) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', animation: 'fadeIn 0.3s' }}>
              <h3 style={{ 
                fontSize: currentTopic.length > 15 ? '3rem' : '4rem', 
                fontWeight: 800, 
                color: isSpinning ? '#9ca3af' : '#1f2937',
                textShadow: isSpinning ? 'none' : '0 4px 15px rgba(0,0,0,0.1)',
                margin: '1rem 0',
                transition: 'all 0.1s ease'
              }}>
                {currentTopic}
              </h3>

              {spinComplete && !isSpinning && (
                <button 
                  onClick={handlePronounceClick}
                  style={{
                    background: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 2.5rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 6px -1px rgba(26, 115, 232, 0.4)',
                    transition: 'all 0.2s ease',
                    animation: 'fadeIn 0.5s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  Pronounce Word
                </button>
              )}
            </div>
          )}

          {/* Phase: Card Displayed */}
          {showCard && (
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #dadce0',
              padding: '1.2rem 1.5rem',
              width: '100%',
              maxWidth: '650px',
              color: '#202124',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'left',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              animation: 'fadeIn 0.3s'
            }}>
              
              {/* Top Row: Word & Dialect Dropdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ebebeb', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '1.5rem', color: '#202124', fontWeight: 500 }}>
                  {currentTopic}
                </div>
                <select 
                  value={selectedVoiceURI} 
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    // Optionally auto-play when changing dialect
                    setTimeout(() => playPronunciation(), 100);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#5f6368',
                    fontSize: '0.95rem',
                    outline: 'none',
                    cursor: 'pointer',
                    textAlign: 'right'
                  }}
                >
                  {voices.length === 0 ? (
                    <option>Loading voices...</option>
                  ) : (
                    voices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name.includes('India') || v.lang === 'en-IN' ? 'Indian English pronunciation' : 
                         v.name.includes('UK') || v.lang === 'en-GB' ? 'British English pronunciation' :
                         v.name.includes('US') || v.lang === 'en-US' ? 'American English pronunciation' : 
                         v.name.replace('Google ', '')}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Middle Row: Phonetics & Face */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#70757a', marginBottom: '0.5rem' }}>Sounds like</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '-0.5px', color: '#202124' }}>
                      {phonetic}
                    </span>
                    <button 
                      onClick={playPronunciation} 
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1a73e8',
                        borderRadius: '50%',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(26,115,232,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      title="Listen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    </button>
                  </div>
                  
                  {/* Bottom Row inside left col: Toggle Switch */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
                      <input 
                        type="checkbox" 
                        checked={isSlowMode} 
                        onChange={(e) => setIsSlowMode(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                      <div style={{
                        width: '36px',
                        height: '20px',
                        background: isSlowMode ? '#1a73e8' : '#b9b9b9',
                        borderRadius: '34px',
                        position: 'relative',
                        transition: '0.2s',
                        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.2)'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          left: isSlowMode ? '18px' : '2px',
                          width: '16px',
                          height: '16px',
                          background: 'white',
                          borderRadius: '50%',
                          transition: '0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                        }} />
                      </div>
                      <span style={{ marginLeft: '10px', fontSize: '0.95rem', color: '#3c4043' }}>Slow</span>
                    </label>
                  </div>
                </div>

                {/* Right Face Graphic (Static CSS drawing) */}
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: '#d2e3fc', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {/* Face contour */}
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute' }}>
                    <path d="M 10 50 Q 60 110 110 50" fill="none" stroke="#1a73e8" strokeWidth="1.5" />
                    <path d="M 45 40 Q 60 55 75 40" fill="none" stroke="#1a73e8" strokeWidth="2" />
                    <path d="M 30 65 Q 60 75 90 65 Q 60 85 30 65" fill="white" stroke="#202124" strokeWidth="2" />
                    <path d="M 50 85 Q 60 90 70 85" fill="none" stroke="#8ab4f8" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              
            </div>
          )}
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
