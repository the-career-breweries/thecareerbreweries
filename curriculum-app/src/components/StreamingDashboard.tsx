import React, { useState, useEffect, useRef } from 'react';
import { WeekData } from '@/data/curriculum';
import { Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';

interface StreamingDashboardProps {
  program: 'ug' | 'pg';
  streamName: string;
  semester: number;
  weeks: WeekData[];
  onSelectLesson: (lesson: WeekData) => void;
  theme: string;
}


const Carousel = ({ title, lessons, startIndex, onSelectLesson, setHoveredLesson, hoveredLesson, cinematicIds }: any) => {
  if (!lessons.length) return null;
  const getImageUrl = (index: number) => `https://images.unsplash.com/photo-${cinematicIds[index % cinematicIds.length]}?q=80&w=600&h=337&fit=crop`;
  
  return (
    <div style={{ marginBottom: '3rem', position: 'relative' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', paddingLeft: '4%' }}>{title}</h3>
      <div 
        className="hide-scrollbar"
        style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        padding: '10px 4%',
        WebkitOverflowScrolling: 'touch',
      }}>
        {lessons.map((lesson: any, idx: number) => (
          <div
            key={lesson.week}
            onClick={() => onSelectLesson(lesson)}
            onMouseEnter={() => setHoveredLesson({ lesson, index: startIndex + idx })}
            onMouseLeave={() => setHoveredLesson(null)}
            style={{
              flex: '0 0 auto',
              width: '300px',
              height: '168px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, border-color 0.3s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              borderColor: hoveredLesson?.lesson.week === lesson.week ? 'var(--accent-primary)' : 'transparent'
            }}
            className="carousel-card"
          >
            <img 
              src={getImageUrl(startIndex + idx)} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt={lesson.theme} 
            />
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '1rem'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Session {lesson.week}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', lineHeight: '1.2', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {lesson.theme}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StreamingDashboard({ program, streamName, semester, weeks, onSelectLesson, theme }: StreamingDashboardProps) {

  // Use specific cinematic background IDs for the thumbnails
  const cinematicIds = [
    '1536440136628-849c177e76a1', '1489599849927-2ee91cede3ba', '1514525253161-7a46d19cd819',
    '1440404653325-ab127d49abc1', '1512820790803-83ca734da794', '1579783902614-a3fb3927b6a5',
    '1511512578047-dfb367046420', '1577083552431-6e5fd01aa342', '1485846234645-a62644f84728',
    '1436491865332-7a61a109cc05', '1517976487492-5750f3195933', '1573164713988-8665fc963095'
  ];

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [hoveredLesson, setHoveredLesson] = useState<{ lesson: WeekData, index: number } | null>(null);

  // Auto-slide billboard every 6 seconds if nothing is hovered
  useEffect(() => {
    if (hoveredLesson || weeks.length === 0) return;

    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % weeks.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [hoveredLesson, weeks.length]);

  const getImageUrl = (index: number) => {
    return `https://images.unsplash.com/photo-${cinematicIds[index % cinematicIds.length]}?q=80&w=600&h=337&fit=crop`;
  };

  const getHeroImageUrl = (index: number) => {
    return `https://images.unsplash.com/photo-${cinematicIds[index % cinematicIds.length]}?q=80&w=2000&auto=format&fit=crop`;
  };

  const activeHeroLesson = hoveredLesson ? hoveredLesson.lesson : weeks[featuredIndex];
  const activeHeroIndex = hoveredLesson ? hoveredLesson.index : featuredIndex;
  
  // Group weeks into categories
  const continueWatching = weeks.slice(0, 3);
  const trending = weeks.slice(3, 8);
  const criticallyAcclaimed = weeks.slice(8);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-app)', color: 'white', overflowX: 'hidden' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .carousel-card:hover {
          transform: scale(1.05);
          z-index: 10;
        }
        .carousel-card {
          border: 2px solid transparent;
        }
        .carousel-card:hover {
          border-color: var(--accent-primary) !important;
        }
        
        
        .hero-banner {
          transition: background-image 0.5s ease-in-out;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

      `}} />

      {/* Hero Billboard */}
      {activeHeroLesson && (
        <div className="hero-banner" style={{
          position: 'relative',
          width: '100%',
          height: '75vh',
          backgroundImage: `url("${getHeroImageUrl(activeHeroIndex)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '10vh'
        }}>
          {/* Gradient overlay to fade into background */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, var(--bg-app) 0%, transparent 20%)',
            zIndex: 1
          }} />
          
          <div style={{ position: 'relative', zIndex: 2, paddingLeft: '4%', maxWidth: '800px', width: '90%', paddingTop: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ 
                background: 'var(--accent-primary)', color: 'white', padding: '4px 8px', 
                borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                {hoveredLesson ? `Session ${activeHeroLesson.week}` : 'Featured'}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e5e7eb', letterSpacing: '4px' }}>
                SERIES
              </span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {activeHeroLesson.theme}
            </h1>
            <p style={{ fontSize: '1.3rem', color: '#d1d5db', marginBottom: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: '1.4' }}>
              Dive into Semester {semester} of {streamName}. Explore {activeHeroLesson.focus} and master the foundations of professional communication.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => onSelectLesson(activeHeroLesson)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  padding: '0.8rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', 
                  backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e5e5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <Play fill="black" size={24} /> Play Now
              </button>
              
              <button 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  padding: '0.8rem 2rem', fontSize: '1.2rem', fontWeight: 'bold', 
                  backgroundColor: 'rgba(109, 109, 110, 0.7)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(109, 109, 110, 0.4)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(109, 109, 110, 0.7)'}
              >
                <Info size={24} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousels Container */}
      <div style={{ position: 'relative', zIndex: 3, marginTop: '-5vh', paddingBottom: '5rem' }}>
        <Carousel 
          title={`Semester ${semester} Episodes`} 
          lessons={weeks} 
          startIndex={0} 
          onSelectLesson={onSelectLesson}
          setHoveredLesson={setHoveredLesson}
          hoveredLesson={hoveredLesson}
          cinematicIds={cinematicIds}
        />
      </div>

    </div>
  );
}
