import React, { useState, useEffect, useRef } from 'react';

const DEBATE_TOPICS_SILLY = [
  "Is a hot dog a sandwich?",
  "Does pineapple belong on pizza?",
  "Would you rather fight one horse-sized duck or 100 duck-sized horses?",
  "Is cereal technically soup?",
  "Should we legally ban the snooze button on alarms?",
  "If you drop food on the floor and pick it up in 5 seconds, is it safe to eat?",
  "Are aliens currently hiding on Earth?",
  "Should everyone be forced to wear a uniform every day?",
  "Should we abolish morning classes before 10 AM?",
  "Is water actually wet?"
];

const DEBATE_TOPICS_AVIATION = [
  "Will AI and automation eventually replace human pilots entirely?",
  "Should airlines completely ban reclining seats?",
  "Is the budget airline model destroying the luxury and dignity of flying?",
  "Should airlines charge passengers based on their body weight?",
  "Are frequent flyer programs basically a scam?",
  "Should in-flight Wi-Fi be legally required to be free?",
  "Is supersonic travel (like the Concorde) worth bringing back despite the environmental cost?",
  "Should governments bail out failing national airlines?",
  "Is working as cabin crew a glamorous job or just high-altitude hospitality?",
  "Should passengers be banned from bringing hot food onto planes?"
];

const DEBATE_TOPICS_CAREER = [
  "Is AI making students lazier?",
  "Should college attendance be mandatory?",
  "Is a degree enough to get a job in 2026?",
  "Should companies ban remote work for entry-level roles?",
  "Are traditional resumes completely dead?",
  "Is social media a net positive for career growth?",
  "Should the gig economy replace traditional employment?",
  "Is the 4-day workweek viable in India?",
  "Are soft skills more important than technical skills?",
  "Should practical internships replace the final year of college?"
];

const VOCAB_TOPICS = [
  "Abysmal", "Acquiesce", "Albeit", "Amalgamate", "Anachronism",
  "Bourgeois", "Cacophony", "Capricious", "Colloquial", "Convalesce",
  "Dichotomy", "Eclectic", "Epitome", "Esoteric", "Exacerbate",
  "Facetious", "Fastidious", "Grandiloquent", "Gregarious", "Hegemony",
  "Iconoclast", "Idiosyncrasy", "Innocuous", "Juxtaposition", "Lackadaisical",
  "Lethargic", "Mellifluous", "Misanthrope", "Nefarious", "Obfuscate",
  "Ostentatious", "Paradigm", "Pedantic", "Quintessential", "Quixotic",
  "Recalcitrant", "Resilience", "Sycophant", "Tangential", "Ubiquitous",
  "Unprecedented", "Vacillate", "Vehement", "Vicarious", "Zealous",
  "Almond", "Athlete", "Boutique", "Cache", "Candidate", "Chaos", 
  "Choir", "Colonel", "Draught", "Epitome", "Faux pas", 
  "Gauge", "Hierarchy", "Ignominious", "Library", "Mischievous", 
  "Niche", "Often", "Paradigm", "Picture", "Prestigious", 
  "Pronunciation", "Quinoa", "Receipt", "Schedule", "Specific", 
  "Subtle", "Suite", "Syllable", "Womb", "Yacht"
];

interface RandomTopicGeneratorProps {
  customTopics?: string[];
  mode?: "debate" | "vocabulary" | "pronunciation";
}

type DebateCategory = "silly" | "career" | "aviation";

export default function RandomTopicGenerator({ customTopics, mode = "debate" }: RandomTopicGeneratorProps = {}) {
  const [currentTopic, setCurrentTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [debateCategory, setDebateCategory] = useState<DebateCategory>("silly");

  // States for voice and speed
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);

  // States for API data
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Independent errors
  const [dictError, setDictError] = useState("");
  const [imgError, setImgError] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && mode !== 'debate') {
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
  }, [selectedVoiceURI, mode]);

  const getActiveDebateTopics = () => {
    if (debateCategory === "silly") return DEBATE_TOPICS_SILLY;
    if (debateCategory === "aviation") return DEBATE_TOPICS_AVIATION;
    return DEBATE_TOPICS_CAREER;
  };

  const activeTopics = customTopics && customTopics.length > 0 && customTopics[0] !== 'spin' 
    ? customTopics 
    : (mode === 'debate' ? getActiveDebateTopics() : VOCAB_TOPICS);

  const fetchWordData = async (word: string) => {
    setIsLoading(true);
    setDictError("");
    setImgError("");
    setMeaning(null);
    setPhonetic("");
    setImages([]);

    // 1. Fetch Dictionary Data
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); 
      
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

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
      } else if (dictRes.status === 404) {
        setDictError("Word definition not found in dictionary.");
      } else {
        setDictError(`Dictionary API returned status ${dictRes.status}.`);
      }
    } catch (err: any) {
      console.error("Dictionary API Error:", err);
      if (err.name === 'AbortError') {
         console.warn("Dictionary API is taking too long to respond right now.");
      } else {
         console.warn("Dictionary API is currently unavailable (network error).");
      }
    }

    // 2. Fetch Google Images
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY;
      const cx = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CX;
      
      if (apiKey && cx) {
        const imgRes = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(word)}&cx=${cx}&key=${apiKey}&searchType=image&num=3`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData.items) {
            setImages(imgData.items.map((item: any) => item.link));
          } else {
            setImgError("Google returned no images for this word.");
          }
        } else {
           const errData = await imgRes.json().catch(() => ({}));
           console.error("Google Image API Error:", errData);
           setImgError(`Image API Failed (${imgRes.status}): ${errData?.error?.message || 'Unknown error'}`);
        }
      } else {
        setImgError("Google API Keys are missing in the environment variables.");
      }
    } catch (err) {
      console.error("Image API Error:", err);
      setImgError("Network error while trying to reach Google Images.");
    }

    setIsLoading(false);
  };

  const spinTopicDebate = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const topics = getActiveDebateTopics();
      const randomIndex = Math.floor(Math.random() * topics.length);
      setCurrentTopic(topics[randomIndex]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 50);
  };

  const spinTopicVocab = () => {
    setShowCard(false);
    setSearchQuery("");
    const randomIndex = Math.floor(Math.random() * activeTopics.length);
    const finalWord = activeTopics[randomIndex];
    setCurrentTopic(finalWord);
    fetchWordData(finalWord).then(() => setShowCard(true));
  };

  const spinTopic = () => {
    if (mode === 'debate') {
      spinTopicDebate();
    } else {
      spinTopicVocab();
    }
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
    window.speechSynthesis.speak(utterance);
  };

  if (mode === 'debate') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem',
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '24px',
        margin: '0 auto',
        width: '100%',
        maxWidth: '900px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Topic Category Selectors */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'silly', label: '🤪 Silly Warmups' },
            { id: 'aviation', label: '✈️ Aviation Topics' },
            { id: 'career', label: '💼 Career & Gen Z' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setDebateCategory(cat.id as DebateCategory);
                setCurrentTopic("");
              }}
              style={{
                background: debateCategory === cat.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: debateCategory === cat.id ? '#38bdf8' : '#94a3b8',
                border: `1px solid ${debateCategory === cat.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button 
          onClick={spinTopic}
          disabled={isSpinning}
          style={{
            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '16px 40px',
            borderRadius: '30px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: isSpinning ? 'default' : 'pointer',
            opacity: isSpinning ? 0.8 : 1,
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
            marginBottom: '3rem',
            transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN THE TOPIC'}
        </button>

        <div style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <h3 style={{ 
            fontSize: (!currentTopic || currentTopic.length > 50) ? '2rem' : (currentTopic.length > 35 ? '2.5rem' : '3rem'), 
            fontWeight: 800, 
            color: isSpinning ? '#cbd5e1' : '#ffffff',
            lineHeight: 1.3,
            textShadow: isSpinning ? 'none' : '0 0 20px rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            transition: 'color 0.1s'
          }}>
            {currentTopic || "Select a category and click 'Spin'!"}
          </h3>
        </div>
        
        {currentTopic && !isSpinning && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '3rem', color: '#94a3b8', fontSize: '1.5rem', fontWeight: '900', animation: 'fadeIn 0.5s' }}>
            <span style={{ color: '#ef4444', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>FOR</span>
            <span>VS</span>
            <span style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34, 197, 94, 0.4)' }}>AGAINST</span>
          </div>
        )}
      </div>
    );
  }

  // Pronunciation / Vocabulary Mode
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
          disabled={isLoading}
          style={{
            background: 'linear-gradient(135deg, #4285f4, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '24px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isLoading ? 'default' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}
        >
          {isLoading ? 'Loading...' : 'Random Word'}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
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

          {/* Independent Error States */}
          {(imgError) && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #ebebeb', color: '#d93025', fontSize: '0.9rem' }}>
              {imgError && <div>{imgError}</div>}
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
