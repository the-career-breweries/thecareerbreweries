import React, { useState, useEffect, useRef } from 'react';

const TOPICS = [
  "Abysmal", "Acquiesce", "Albeit", "Amalgamate", "Anachronism",
  "Bourgeois", "Cacophony", "Capricious", "Colloquial", "Convalesce",
  "Dichotomy", "Eclectic", "Epitome", "Esoteric", "Exacerbate",
  "Facetious", "Fastidious", "Grandiloquent", "Gregarious", "Hegemony",
  "Iconoclast", "Idiosyncrasy", "Innocuous", "Juxtaposition", "Lackadaisical",
  "Lethargic", "Mellifluous", "Misanthrope", "Nefarious", "Obfuscate",
  "Ostentatious", "Paradigm", "Pedantic", "Quintessential", "Quixotic",
  "Recalcitrant", "Resilience", "Sycophant", "Tangential", "Ubiquitous",
  "Unprecedented", "Vacillate", "Vehement", "Vicarious", "Zealous",
  "Almond", "Athlete", "Cache", "Candidate", "Chaos", 
  "Choir", "Colonel", "Draught", "Epitome", "Faux pas", 
  "Gauge", "Hierarchy", "Ignominious", "Library", "Mischievous", 
  "Niche", "Often", "Paradigm", "Picture", "Prestigious", 
  "Pronunciation", "Quinoa", "Receipt", "Schedule", "Specific", 
  "Subtle", "Suite", "Syllable", "Womb", "Yacht"
];

interface RandomTopicGeneratorProps {
  customTopics?: string[];
  mode?: "debate" | "vocabulary";
}

export default function RandomTopicGenerator({ customTopics, mode = "debate" }: RandomTopicGeneratorProps = {}) {
  const [currentTopic, setCurrentTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // States for voice and speed
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // States for API data
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
        const usVoice = allVoices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-US');
        const gbVoice = allVoices.find(v => v.lang === 'en-GB' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-GB');
        const inVoice = allVoices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-IN');
        
        const uniqueVoices = [];
        if (usVoice) uniqueVoices.push(usVoice);
        else uniqueVoices.push({ voiceURI: 'fallback-us', lang: 'en-US', name: 'American English pronunciation' } as any);
        
        if (gbVoice) uniqueVoices.push(gbVoice);
        else uniqueVoices.push({ voiceURI: 'fallback-gb', lang: 'en-GB', name: 'British English pronunciation' } as any);
        
        if (inVoice) uniqueVoices.push(inVoice);
        else uniqueVoices.push({ voiceURI: 'fallback-in', lang: 'en-IN', name: 'Indian English pronunciation' } as any);
        
        setVoices(uniqueVoices);
        if (uniqueVoices.length > 0 && !selectedVoiceURI) {
          const defaultVoice = usVoice || gbVoice || inVoice || uniqueVoices[0];
          if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI]);

  const activeTopics = customTopics && customTopics.length > 0 && customTopics[0] !== 'spin' ? customTopics : TOPICS;

  const fetchWordData = async (word: string) => {
    setIsLoading(true);
    setErrorMsg("");
    setMeaning(null);
    setPhonetic("");
    setImages([]);

    try {
      // 1. Fetch Dictionary Data
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (dictRes.ok) {
        const data = await dictRes.json();
        const entry = data[0];
        setPhonetic(entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || "");
        
        const firstMeaning = entry.meanings?.[0];
        if (firstMeaning) {
          setMeaning({
            partOfSpeech: firstMeaning.partOfSpeech,
            definition: firstMeaning.definitions[0]?.definition,
            example: firstMeaning.definitions[0]?.example
          });
        }
      }

      // 2. Fetch Google Images if API key is present
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY;
      const cx = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CX;
      
      if (apiKey && cx) {
        const imgRes = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(word)}&cx=${cx}&key=${apiKey}&searchType=image&num=3`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData.items) {
            setImages(imgData.items.map((item: any) => item.link));
          }
        }
      }
    } catch (err) {
      console.error("Error fetching word data:", err);
      setErrorMsg("Failed to load word data.");
    } finally {
      setIsLoading(false);
    }
  };

  const spinTopic = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowCard(false);
    setSearchQuery("");

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * activeTopics.length);
      setCurrentTopic(activeTopics[randomIndex]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalWord = activeTopics[randomIndex];
        setCurrentTopic(finalWord);
        fetchWordData(finalWord).then(() => setShowCard(true));
      }
    }, 50);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setCurrentTopic(searchQuery.trim());
    setShowCard(false);
    fetchWordData(searchQuery.trim()).then(() => setShowCard(true));
  };

  const playPronunciation = () => {
    if (!window.speechSynthesis || !currentTopic) return;
    const utterance = new SpeechSynthesisUtterance(currentTopic);
    
    if (selectedVoiceURI) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) {
        if (!voice.voiceURI.startsWith('fallback-')) {
          utterance.voice = voice as SpeechSynthesisVoice;
        }
        utterance.lang = voice.lang;
      }
    } else {
      utterance.lang = 'en-US'; 
    }
    
    utterance.rate = isSlowMode ? 0.5 : 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      width: '100%'
    }}>
      
      {/* Search & Spin Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', width: '100%', maxWidth: '650px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, minWidth: '250px' }}>
          <input 
            type="text" 
            placeholder="Type a word..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '1.1rem',
              border: '1px solid #dfe1e5',
              borderRadius: '24px 0 0 24px',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '0 24px',
              background: '#f8f9fa',
              border: '1px solid #dfe1e5',
              borderLeft: 'none',
              borderRadius: '0 24px 24px 0',
              cursor: 'pointer',
              color: '#1a73e8',
              fontWeight: 600
            }}
          >
            Search
          </button>
        </form>
        
        <button 
          onClick={spinTopic}
          disabled={isSpinning}
          style={{
            background: 'linear-gradient(135deg, #4285f4, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '24px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isSpinning ? 'default' : 'pointer',
            opacity: isSpinning ? 0.7 : 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}
        >
          {isSpinning ? 'Spinning...' : 'Spin Random'}
        </button>
      </div>

      {/* Spinning Display */}
      {isSpinning && (
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1a73e8',
          margin: '2rem 0',
          fontFamily: 'monospace'
        }}>
          {currentTopic}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !isSpinning && (
        <div style={{ margin: '2rem 0', color: '#5f6368' }}>Fetching dictionary and images...</div>
      )}

      {/* Main Pronunciation Card */}
      {showCard && !isLoading && (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #dadce0',
          padding: '1.2rem 1.5rem',
          width: '100%',
          maxWidth: '650px',
          color: '#202124',
          fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
          textAlign: 'left',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          animation: 'fadeIn 0.3s'
        }}>
          
          {/* Top Row: Word & Dialect Dropdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ebebeb', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
            <div style={{ fontSize: '1.5rem', color: '#202124', fontWeight: 400, textTransform: 'capitalize' }}>
              {currentTopic}
            </div>
            <select 
              value={selectedVoiceURI} 
              onChange={(e) => {
                setSelectedVoiceURI(e.target.value);
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
                <span style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.5px', color: '#202124' }}>
                  {phonetic || currentTopic}
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

            {/* Right Face Graphic (Google Style) */}
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
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute' }}>
                {/* Nose / upper lip contour */}
                <path d="M 50 45 Q 60 55 70 45" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" />
                
                {/* Lips */}
                <path d="M 30 65 Q 60 75 90 65 Q 60 85 30 65" fill={isSpeaking ? "#202124" : "white"} stroke="#202124" strokeWidth="2" strokeLinejoin="round" />
                
                {/* Chin */}
                <path d="M 50 85 Q 60 90 70 85" fill="none" stroke="#8ab4f8" strokeWidth="2" strokeLinecap="round" />
                <path d="M 15 65 Q 60 125 105 65" fill="none" stroke="#8ab4f8" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Dictionary & Image Section */}
          {(meaning || images.length > 0) && (
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #ebebeb' }}>
              
              {/* Meaning */}
              {meaning && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#202124', marginBottom: '0.5rem' }}>
                    Meaning <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#70757a', fontStyle: 'italic', marginLeft: '8px' }}>{meaning.partOfSpeech}</span>
                  </div>
                  <div style={{ color: '#3c4043', fontSize: '1rem', lineHeight: '1.5' }}>
                    {meaning.definition}
                  </div>
                  {meaning.example && (
                    <div style={{ color: '#70757a', fontSize: '0.95rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                      "{meaning.example}"
                    </div>
                  )}
                </div>
              )}

              {/* Images */}
              {images.length > 0 && (
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#202124', marginBottom: '1rem' }}>
                    Images
                  </div>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {images.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt={currentTopic}
                        style={{
                          height: '120px',
                          width: '180px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ebebeb'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {errorMsg && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #ebebeb', color: '#d93025' }}>
              {errorMsg}
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
