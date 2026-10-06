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
  "Is water actually wet?",
  "Does a straw have one hole or two?",
  "If a tomato is a fruit, is ketchup a smoothie?",
  "Is Die Hard a Christmas movie?",
  "Should it be a crime to put milk in the bowl before the cereal?",
  "Are hot dogs just American tacos?",
  "Should toilet paper hang over or under the roll?",
  "Is it acceptable to wear socks with sandals?",
  "Should brushing your teeth be done before or after breakfast?",
  "Is Batman actually a superhero if he has no superpowers?",
  "Are ghosts real or just bad eyesight?",
  "Which is a superior pet: a dog that acts like a cat, or a cat that acts like a dog?",
  "Should we permanently replace handshakes with fist bumps?",
  "Do fish get thirsty?",
  "Is a thumb technically a finger?",
  "Should humans sleep in pods instead of beds?"
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

const VOCAB_DICTIONARY = [
  // Generic Frequent
  { word: "Entrepreneur", phonetic: "ahn·truh·pruh·nur", partOfSpeech: "noun", meaning: "A person who organizes and operates a business.", category: "gen-freq" },
  { word: "Rendezvous", phonetic: "ron·day·voo", partOfSpeech: "noun", meaning: "A meeting at an agreed time and place.", category: "gen-freq" },
  { word: "Itinerary", phonetic: "ai·ti·nuh·reh·ree", partOfSpeech: "noun", meaning: "A planned route or journey.", category: "gen-freq" },
  { word: "Faux pas", phonetic: "foe pah", partOfSpeech: "noun", meaning: "An embarrassing or tactless act or remark in a social situation.", category: "gen-freq" },
  { word: "Quinoa", phonetic: "keen·waa", partOfSpeech: "noun", meaning: "A goosefoot plant grown as a crop primarily for its edible seeds.", category: "gen-freq" },
  { word: "Mischievous", phonetic: "mis·chuh·vus", partOfSpeech: "adjective", meaning: "Causing or showing a fondness for causing trouble in a playful way.", category: "gen-freq" },
  { word: "Epitome", phonetic: "uh·pi·tuh·mee", partOfSpeech: "noun", meaning: "A person or thing that is a perfect example of a particular quality or type.", category: "gen-freq" },
  { word: "Colonel", phonetic: "kur·nl", partOfSpeech: "noun", meaning: "An army officer of high rank.", category: "gen-freq" },
  { word: "Draught", phonetic: "draft", partOfSpeech: "noun", meaning: "A current of unpleasantly cold air blowing through a room.", category: "gen-freq" },
  { word: "Almond", phonetic: "aa·mund", partOfSpeech: "noun", meaning: "The oval nut-like seed (kernel) of the almond tree.", category: "gen-freq" },
  { word: "Niche", phonetic: "neesh", partOfSpeech: "noun", meaning: "A comfortable or suitable position in life or employment.", category: "gen-freq" },
  { word: "Suite", phonetic: "sweet", partOfSpeech: "noun", meaning: "A set of rooms designated for one person's or family's use.", category: "gen-freq" },
  { word: "Yacht", phonetic: "yaat", partOfSpeech: "noun", meaning: "A medium-sized sailboat equipped for cruising or racing.", category: "gen-freq" },
  { word: "Paradigm", phonetic: "pa·ruh·daim", partOfSpeech: "noun", meaning: "A typical example or pattern of something; a model.", category: "gen-freq" },
  { word: "Subtle", phonetic: "suh·tl", partOfSpeech: "adjective", meaning: "So delicate or precise as to be difficult to analyze or describe.", category: "gen-freq" },
  { word: "Choir", phonetic: "kwai·ur", partOfSpeech: "noun", meaning: "An organized group of singers, typically one that takes part in church services.", category: "gen-freq" },

  // Generic Rare
  { word: "Sycophant", phonetic: "si·kuh·fuhnt", partOfSpeech: "noun", meaning: "A person who acts obsequiously toward someone important in order to gain advantage.", category: "gen-rare" },
  { word: "Obfuscate", phonetic: "ob·fuh·skayt", partOfSpeech: "verb", meaning: "Render obscure, unclear, or unintelligible.", category: "gen-rare" },
  { word: "Cacophony", phonetic: "kuh·ko·fuh·nee", partOfSpeech: "noun", meaning: "A harsh, discordant mixture of sounds.", category: "gen-rare" },
  { word: "Grandiloquent", phonetic: "gran·di·luh·kwuhnt", partOfSpeech: "adjective", meaning: "Pompous or extravagant in language, style, or manner.", category: "gen-rare" },
  { word: "Hegemony", phonetic: "huh·jeh·muh·nee", partOfSpeech: "noun", meaning: "Leadership or dominance, especially by one country or social group over others.", category: "gen-rare" },
  { word: "Idiosyncrasy", phonetic: "i·dee·uh·sing·kruh·see", partOfSpeech: "noun", meaning: "A mode of behavior or way of thought peculiar to an individual.", category: "gen-rare" },
  { word: "Mellifluous", phonetic: "muh·li·floo·us", partOfSpeech: "adjective", meaning: "Sweet or musical; pleasant to hear.", category: "gen-rare" },
  { word: "Ostentatious", phonetic: "o·sten·tay·shus", partOfSpeech: "adjective", meaning: "Characterized by vulgar or pretentious display; designed to impress or attract notice.", category: "gen-rare" },
  { word: "Quixotic", phonetic: "kwik·so·tik", partOfSpeech: "adjective", meaning: "Exceedingly idealistic; unrealistic and impractical.", category: "gen-rare" },
  { word: "Esoteric", phonetic: "e·suh·teh·rik", partOfSpeech: "adjective", meaning: "Intended for or likely to be understood by only a small number of people.", category: "gen-rare" },
  { word: "Anachronism", phonetic: "uh·na·kruh·ni·zum", partOfSpeech: "noun", meaning: "A thing belonging or appropriate to a period other than that in which it exists.", category: "gen-rare" },
  { word: "Ephemeral", phonetic: "uh·feh·muh·rul", partOfSpeech: "adjective", meaning: "Lasting for a very short time.", category: "gen-rare" },
  { word: "Ineffable", phonetic: "in·eh·fuh·bul", partOfSpeech: "adjective", meaning: "Too great or extreme to be expressed or described in words.", category: "gen-rare" },
  { word: "Fastidious", phonetic: "fa·sti·dee·us", partOfSpeech: "adjective", meaning: "Very attentive to and concerned about accuracy and detail.", category: "gen-rare" },
  { word: "Recalcitrant", phonetic: "ri·kal·si·trunt", partOfSpeech: "adjective", meaning: "Having an obstinately uncooperative attitude toward authority or discipline.", category: "gen-rare" },

  // Aviation Frequent
  { word: "Fuselage", phonetic: "fyoo·zuh·laazh", partOfSpeech: "noun", meaning: "The main body of an aircraft.", category: "av-freq" },
  { word: "Aileron", phonetic: "ay·luh·ron", partOfSpeech: "noun", meaning: "A hinged surface in the trailing edge of an airplane wing, used to control the roll of the aircraft.", category: "av-freq" },
  { word: "Empennage", phonetic: "em·puh·naazh", partOfSpeech: "noun", meaning: "The tail assembly of an aircraft, including the horizontal and vertical stabilizers.", category: "av-freq" },
  { word: "Altimeter", phonetic: "al·ti·mee·tur", partOfSpeech: "noun", meaning: "An instrument used to measure the altitude of an object above a fixed level.", category: "av-freq" },
  { word: "Turboprop", phonetic: "tur·bow·prop", partOfSpeech: "noun", meaning: "A jet engine in which a turbine is used to drive a propeller.", category: "av-freq" },
  { word: "Nacelle", phonetic: "nuh·sel", partOfSpeech: "noun", meaning: "A streamlined housing or enclosure, typically for an aircraft engine.", category: "av-freq" },
  { word: "Avionics", phonetic: "ay·vee·o·niks", partOfSpeech: "noun", meaning: "The electronic systems used on aircraft, artificial satellites, and spacecraft.", category: "av-freq" },
  { word: "Taxiway", phonetic: "tak·see·way", partOfSpeech: "noun", meaning: "A path for aircraft at an airport connecting runways with aprons, hangars, and terminals.", category: "av-freq" },
  { word: "Meteorology", phonetic: "mee·tee·uh·ro·luh·jee", partOfSpeech: "noun", meaning: "The branch of science concerned with the processes and phenomena of the atmosphere.", category: "av-freq" },
  { word: "Aerodynamic", phonetic: "air·oh·dai·na·mik", partOfSpeech: "adjective", meaning: "Relating to the study of the properties of moving air, and especially of the interaction between the air and solid bodies.", category: "av-freq" },
  { word: "Turbulence", phonetic: "tur·byuh·luhns", partOfSpeech: "noun", meaning: "Violent or unsteady movement of air or water, or of some other fluid.", category: "av-freq" },
  { word: "Concierge", phonetic: "kon·see·erzh", partOfSpeech: "noun", meaning: "A resident caretaker of a block of flats or a small hotel.", category: "av-freq" },
  { word: "Carousel", phonetic: "ka·ruh·sel", partOfSpeech: "noun", meaning: "A continuous moving strip on which passengers' bags are placed for collection at an airport.", category: "av-freq" },
  { word: "Tarmac", phonetic: "taar·mak", partOfSpeech: "noun", meaning: "A runway, apron, or taxiway on an airport.", category: "av-freq" },

  // Aviation Rare
  { word: "Pitot", phonetic: "pee·toe", partOfSpeech: "noun", meaning: "A tube pointing into the flow of a fluid to measure its pressure, used on aircraft to determine airspeed.", category: "av-rare" },
  { word: "Dihedral", phonetic: "dai·hee·drul", partOfSpeech: "noun", meaning: "The upward angle of an aircraft's wings from the horizontal.", category: "av-rare" },
  { word: "Anhedral", phonetic: "an·hee·drul", partOfSpeech: "noun", meaning: "The downward angle of an aircraft's wings from the horizontal.", category: "av-rare" },
  { word: "Gyroscopic", phonetic: "jai·ruh·sko·pik", partOfSpeech: "adjective", meaning: "Relating to a gyroscope, maintaining orientation based on the principle of conservation of angular momentum.", category: "av-rare" },
  { word: "Ephemeris", phonetic: "i·feh·muh·ris", partOfSpeech: "noun", meaning: "A table or data file giving the calculated positions of a celestial object at regular intervals.", category: "av-rare" },
  { word: "Aerofoil", phonetic: "air·oh·foyl", partOfSpeech: "noun", meaning: "A structure with curved surfaces designed to give the most favorable ratio of lift to drag in flight.", category: "av-rare" },
  { word: "Altimetry", phonetic: "al·ti·mi·tree", partOfSpeech: "noun", meaning: "The measurement of altitude.", category: "av-rare" },
  { word: "Isogonic", phonetic: "ai·suh·go·nik", partOfSpeech: "adjective", meaning: "Relating to or denoting lines on a map connecting points of equal magnetic variation.", category: "av-rare" },
  { word: "Hypoxia", phonetic: "hai·pok·see·uh", partOfSpeech: "noun", meaning: "Deficiency in the amount of oxygen reaching the tissues, a critical risk at high altitudes.", category: "av-rare" },
  { word: "Barotrauma", phonetic: "ba·row·traw·muh", partOfSpeech: "noun", meaning: "Injury caused by a change in air pressure, typically affecting the ear or lung.", category: "av-rare" }
];

interface RandomTopicGeneratorProps {
  customTopics?: string[];
  mode?: "debate" | "vocabulary" | "pronunciation";
}

type DebateCategory = "silly" | "career" | "aviation";
type VocabCategory = "gen-freq" | "gen-rare" | "av-freq" | "av-rare";

export default function RandomTopicGenerator({ customTopics, mode = "debate" }: RandomTopicGeneratorProps = {}) {
  const [currentTopic, setCurrentTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [debateCategory, setDebateCategory] = useState<DebateCategory>("silly");
  const [vocabCategory, setVocabCategory] = useState<VocabCategory>("gen-freq");
  
  const [debateTopics, setDebateTopics] = useState<Record<DebateCategory, string[]>>({
    silly: DEBATE_TOPICS_SILLY,
    aviation: DEBATE_TOPICS_AVIATION,
    career: DEBATE_TOPICS_CAREER
  });
  const [usedTopics, setUsedTopics] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tcb_debate_topics');
    if (saved) {
      try { setDebateTopics(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSaveTopics = (text: string) => {
    const newTopics = text.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    const updated = { ...debateTopics, [debateCategory]: newTopics };
    setDebateTopics(updated);
    localStorage.setItem('tcb_debate_topics', JSON.stringify(updated));
    setUsedTopics(new Set()); // Reset used topics when modifying list
  };

  // States for voice and speed
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);

  // States for API data
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
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

  const fetchWordData = async (word: string) => {
    setIsLoading(true);
    setDictError("");
    setImgError("");
    setMeaning(null);
    setPhonetic("");
    setImages([]);
    setShowDetails(false);

    // 1. Check local dictionary first
    const localEntry = VOCAB_DICTIONARY.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (localEntry) {
      setPhonetic(localEntry.phonetic);
      setMeaning({
        partOfSpeech: localEntry.partOfSpeech,
        definition: localEntry.meaning,
        example: ""
      });
    } else {
      // Fallback to Free Dictionary API
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

    const allTopics = debateTopics[debateCategory];
    if (!allTopics || allTopics.length === 0) {
      setCurrentTopic("Please add topics in Admin mode.");
      setIsSpinning(false);
      return;
    }

    let availableTopics = allTopics.filter(t => !usedTopics.has(t));
    if (availableTopics.length === 0) {
      // Reset if all used
      setUsedTopics(new Set());
      availableTopics = allTopics;
    }

    const finalTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      const randomVisualIndex = Math.floor(Math.random() * allTopics.length);
      setCurrentTopic(allTopics[randomVisualIndex]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        setCurrentTopic(finalTopic);
        setUsedTopics(prev => new Set(prev).add(finalTopic));
        setIsSpinning(false);
      }
    }, 50);
  };

  const spinTopicVocab = () => {
    setShowCard(false);
    setSearchQuery("");
    
    // Pick from the selected category
    const categoryWords = VOCAB_DICTIONARY.filter(w => w.category === vocabCategory);
    const randomIndex = Math.floor(Math.random() * categoryWords.length);
    const finalWord = categoryWords[randomIndex].word;
    
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
                setUsedTopics(new Set());
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
            transition: 'color 0.1s',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            maxWidth: '100%',
            padding: '0 10px',
            margin: 0
          }}>
            {currentTopic || "Select a category and click 'Spin'!"}
          </h3>
        </div>
        
        {currentTopic && !isSpinning && currentTopic !== "Please add topics in Admin mode." && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '3rem', color: '#94a3b8', fontSize: '1.5rem', fontWeight: '900', animation: 'fadeIn 0.5s' }}>
            <span style={{ color: '#ef4444', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>FOR</span>
            <span>VS</span>
            <span style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34, 197, 94, 0.4)' }}>AGAINST</span>
          </div>
        )}

        {/* Admin Section */}
        <div style={{ width: '100%', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              opacity: 0.7
            }}
          >
            ⚙️ {isAdmin ? 'Close Admin' : 'Admin: Edit Topics'}
          </button>
          
          {isAdmin && (
            <div style={{ marginTop: '1rem', width: '100%', animation: 'fadeIn 0.3s' }}>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Editing topics for: <strong>{debateCategory.toUpperCase()}</strong> (One per line)
              </div>
              <textarea 
                value={debateTopics[debateCategory]?.join('\n') || ""}
                onChange={(e) => handleSaveTopics(e.target.value)}
                style={{
                  width: '100%',
                  height: '150px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Topics auto-save. Current count: {debateTopics[debateCategory]?.length || 0}. Used so far: {usedTopics.size}.
              </div>
            </div>
          )}
        </div>
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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', width: '100%', maxWidth: '650px', flexWrap: 'wrap' }}>
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

      {/* Vocab Categories Toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', width: '100%', maxWidth: '650px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'gen-freq', label: '🌍 Generic (Frequent)' },
            { id: 'gen-rare', label: '🧠 Generic (Rare)' },
            { id: 'av-freq', label: '✈️ Aviation (Frequent)' },
            { id: 'av-rare', label: '👨‍✈️ Aviation (Rare)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setVocabCategory(cat.id as VocabCategory)}
              style={{
                background: vocabCategory === cat.id ? '#e8f0fe' : 'transparent',
                color: vocabCategory === cat.id ? '#1a73e8' : '#5f6368',
                border: `1px solid ${vocabCategory === cat.id ? '#1a73e8' : '#dadce0'}`,
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          ))}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: showDetails ? '1px solid #ebebeb' : 'none', paddingBottom: showDetails ? '0.8rem' : '0', marginBottom: showDetails ? '1.2rem' : '0' }}>
            <div style={{ fontSize: '1.5rem', color: '#202124', fontWeight: 400, textTransform: 'capitalize' }}>
              {currentTopic}
            </div>
            
            {!showDetails ? (
              <button 
                onClick={() => {
                  setShowDetails(true);
                  setTimeout(() => playPronunciation(), 100);
                }}
                style={{
                  background: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Pronounce
              </button>
            ) : (
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
            )}
          </div>

          {showDetails && (
            <>
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
            </>
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
