import React from 'react';

export default function QRCodeForm() {
  // This links directly to the feedback page we just built
  const formUrl = "https://thecareerbreweries.onrender.com/feedback/soft-skills"; 
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=2&data=${encodeURIComponent(formUrl)}`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      margin: '2rem auto',
      width: '100%',
      maxWidth: '600px'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        color: '#1e293b'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
          Session Feedback
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>
          Your thoughts help us improve future sessions!<br/>
          Point your phone camera here to begin.
        </p>
        
        <img 
          src={qrImageUrl} 
          alt="Feedback QR Code" 
          style={{ 
            width: '200px', 
            height: '200px', 
            display: 'block',
            margin: '0 auto',
            border: '4px solid #f1f5f9',
            borderRadius: '8px'
          }} 
        />
      </div>
    </div>
  );
}
