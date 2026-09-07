import React, { useState, useEffect } from 'react';

export default function BookTracker({ onSaveSession }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [bookTitle, setBookTitle] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleSave = () => {
    if (!bookTitle) return alert('กรุณากรอกชื่อหนังสือ');
    onSaveSession({
      id: Date.now(),
      title: bookTitle,
      durationMinutes: Math.max(1, Math.round(seconds / 60)),
      date: new Date().toLocaleDateString('th-TH'),
    });
    setSeconds(0);
    setIsActive(false);
    setBookTitle('');
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h2>⏱️ จับเวลาอ่านหนังสือ</h2>
      <input
        type="text"
        placeholder="ชื่อหนังสือ..."
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
        style={{ padding: '0.5rem', width: '80%', marginBottom: '1rem' }}
      />
      <h1>{Math.floor(seconds / 60)} นาที {seconds % 60} วินาที</h1>
      <button onClick={() => setIsActive(!isActive)} style={{ marginRight: '0.5rem' }}>
        {isActive ? 'พัก' : 'เริ่มอ่าน'}
      </button>
      <button onClick={handleSave} disabled={seconds === 0}>
        บันทึกผล
      </button>
    </div>
  );
}