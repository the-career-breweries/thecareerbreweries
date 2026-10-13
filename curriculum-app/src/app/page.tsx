"use client";

import Link from 'next/link';
import { BookOpen, Code, Upload, BarChart } from 'lucide-react';
import './globals.css';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>The Career Breweries</h1>
        <p className={styles.subtitle}>Curriculum Management Portal</p>
        
        <div className={styles.grid}>
          {/* Soft Skills */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper} ${styles.blue}`}>
                <UsersIcon />
              </div>
              <h2 className={styles.cardTitle}>
                Soft Skill - I
                <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px', verticalAlign: 'middle', letterSpacing: '0.04em' }}>
                  Z7AVA 26210
                </span>
              </h2>
              <p className={styles.cardDesc}>Interactive personality development, professional presence & communication sessions.</p>
              
              <div className={styles.links}>
                <Link href="/soft-skills" className={`${styles.link} ${styles.primary}`}>
                  ▶ Launch Presentation
                </Link>
                <Link href="/admin/soft-skills" className={`${styles.link} ${styles.secondary}`}>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                    <Upload size={16} /> Admin: Upload Assets
                  </span>
                </Link>
                <Link href="/admin/feedback/soft-skills" className={`${styles.link} ${styles.secondary}`}>
                  <span style={{display: 'inline-flex', alignItems: 'center', gap: '8px'}}>
                    <BarChart size={16} /> View Feedback
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Communicative English */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper} ${styles.indigo}`}>
                <BookOpen size={24} />
              </div>
              <h2 className={styles.cardTitle}>
                Communicative English
                <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px', verticalAlign: 'middle', letterSpacing: '0.04em' }}>
                  Z7AVB 26203
                </span>
              </h2>
              <p className={styles.cardDesc}>Functional grammar, aviation phraseology, business letters & technical reporting.</p>
              
              <div className={styles.links}>
                <Link href="/communicative-english" className={`${styles.link} ${styles.indigo}`}>
                  ▶ Launch Presentation
                </Link>
              </div>
            </div>
          </div>

          {/* Computing Skills */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper} ${styles.emerald}`}>
                <Code size={24} />
              </div>
              <h2 className={styles.cardTitle}>
                Introduction to Computing Skills
                <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px', verticalAlign: 'middle', letterSpacing: '0.04em' }}>
                  Z7AVA 26209
                </span>
              </h2>
              <p className={styles.cardDesc}>Hardware architecture, MS Word, Excel formulas, PowerPoint & cyber safety.</p>
              
              <div className={styles.links}>
                <Link href="/computing-skills" className={`${styles.link} ${styles.emerald}`}>
                  ▶ Launch Presentation
                </Link>
              </div>
            </div>
          </div>

          {/* Workshops */}
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={`${styles.iconWrapper}`} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <CalendarIcon />
              </div>
              <h2 className={styles.cardTitle}>Workshops</h2>
              <p className={styles.cardDesc}>Manage workshop batches, registration, and student portals.</p>
              
              <div className={styles.links}>
                <Link href="/workshops/admin" className={`${styles.link} ${styles.secondary}`}>
                  ⚙️ Workshop Admin
                </Link>
                <Link href="/workshops/register" className={`${styles.link} ${styles.secondary}`}>
                  📝 Registration Form
                </Link>
                <Link href="/workshops/student" className={`${styles.link} ${styles.secondary}`}>
                  🎓 Student Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
