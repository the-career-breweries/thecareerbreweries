import os

filepath = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\StreamingDashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Update props interface
old_interface = """interface StreamingDashboardProps {
    program: 'ug' | 'pg';
    streamName: string;
    semester: number;
    weeks: WeekData[];
    onSelectLesson: (lesson: WeekData) => void;
    theme: string;
  }
  
  export default function StreamingDashboard({ program, streamName, semester, weeks, onSelectLesson, theme }: StreamingDashboardProps) {"""

new_interface = """interface StreamingDashboardProps {
    program: 'ug' | 'pg';
    streamName: string;
    semester: number;
    weeks: WeekData[];
    onSelectLesson: (lesson: WeekData) => void;
    theme: string;
    sessionProgress?: Record<number, number>;
  }
  
  export default function StreamingDashboard({ program, streamName, semester, weeks, onSelectLesson, theme, sessionProgress = {} }: StreamingDashboardProps) {"""

content = content.replace(old_interface, new_interface)

# Add progress bar to the thumbnail
old_thumbnail = """                    <div className="streaming-thumbnail-container" onClick={() => onSelectLesson(week)}>
                      <img src={`https://images.unsplash.com/photo-${cinematicIds[index % cinematicIds.length]}?auto=format&fit=crop&q=80&w=600`} alt={week.theme} className="streaming-thumbnail" />
                      <div className="streaming-play-overlay">
                        <Play fill="white" size={48} />
                      </div>
                    </div>"""
                    
new_thumbnail = """                    <div className="streaming-thumbnail-container" onClick={() => onSelectLesson(week)} style={{ position: 'relative', overflow: 'hidden' }}>
                      <img src={`https://images.unsplash.com/photo-${cinematicIds[index % cinematicIds.length]}?auto=format&fit=crop&q=80&w=600`} alt={week.theme} className="streaming-thumbnail" />
                      <div className="streaming-play-overlay">
                        <Play fill="white" size={48} />
                      </div>
                      
                      {/* Session Progress Bar (Netflix style) */}
                      {sessionProgress[week.week] !== undefined && sessionProgress[week.week] > 0 && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)', zIndex: 10 }}>
                           <div style={{ width: `${sessionProgress[week.week]}%`, height: '100%', background: '#e50914', transition: 'width 0.3s' }} />
                        </div>
                      )}
                    </div>"""

content = content.replace(old_thumbnail, new_thumbnail)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
