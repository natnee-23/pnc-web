import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics({ sessions }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
      <h2>📊 สถิติการอ่าน</h2>
      {sessions.length === 0 ? (
        <p>ยังไม่มีข้อมูลการอ่าน บันทึกเวลาอ่านเพื่อดูสถิติ</p>
      ) : (
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={sessions}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="durationMinutes" fill="#4F46E5" name="เวลา (นาที)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}