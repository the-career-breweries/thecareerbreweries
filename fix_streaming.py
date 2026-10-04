import re

with open('curriculum-app/src/components/StreamingDashboard.tsx', 'r') as f:
    content = f.read()

carousel_code = r'''
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
'''

content = content.replace('export default function StreamingDashboard({ program, streamName, semester, weeks, onSelectLesson, theme }: StreamingDashboardProps) {', carousel_code)

old_carousel_pattern = re.compile(r'  const Carousel = \(\{ title, lessons, startIndex \}: \{ title: string, lessons: WeekData\[\], startIndex: number \}\) => \{.*?\};\n\n  return \(', re.DOTALL)
content = old_carousel_pattern.sub('  return (', content)

css_patch = r'''
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
'''
content = content.replace('.hero-banner {\n          transition: background-image 0.5s ease-in-out;\n        }', css_patch)

call_pattern = re.compile(r'<Carousel title=\{`Semester \$\{semester\} Episodes`\} lessons=\{weeks\} startIndex=\{0\} />')
new_call = r'''<Carousel 
          title={`Semester ${semester} Episodes`} 
          lessons={weeks} 
          startIndex={0} 
          onSelectLesson={onSelectLesson}
          setHoveredLesson={setHoveredLesson}
          hoveredLesson={hoveredLesson}
          cinematicIds={cinematicIds}
        />'''
content = call_pattern.sub(new_call, content)

with open('curriculum-app/src/components/StreamingDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
