import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, RefreshCw, Heart, 
  Target, Layers, Plus, Clock, Trash2, Calendar, Edit3, Smile, Sun, LayoutDashboard, CalendarDays, CheckCircle2, Shuffle, Lightbulb
} from 'lucide-react';

const HEALING_QUOTES = [
  "การพักผ่อนไม่ใช่เรื่องผิด วันนี้เซฟพลังใจ แล้วค่อยไปต่อพรุ่งนี้นะ ✨",
  "ไม่ว่าวันนี้จะเจอเรื่องแย่แค่ไหนมา เก่งมากแล้วนะที่ผ่านมันมาได้ 🤍",
  "ก้าวทีละนิด ก็เข้าใกล้ความสำเร็จไปอีกขั้น ไม่ต้องรีบแข่งกับใครเลย 🌟",
  "ถ้าเหนื่อยก็พักสักหน่อย สมองและหัวใจของคุณต้องการการดูแลนะ 🔋",
  "วันนี้ทำได้แค่นี้ก็ไม่เป็นไรเลย คุณเต็มที่ในแบบของคุณแล้ว 👍",
  "อย่าลืมใจดีกับตัวเองให้มากๆ นะ วันนี้คุณเก่งที่สุดแล้ว ✨"
];

export default function App() {
  // บันทึกและดึงข้อมูล subjects จาก localStorage
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('pnc_study_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  // บันทึกและดึงข้อมูล hoursPerDay จาก localStorage
  const [hoursPerDay, setHoursPerDay] = useState(() => {
    const savedHours = localStorage.getItem('pnc_study_hours');
    return savedHours ? JSON.parse(savedHours) : 4;
  });

  // บันทึกและดึงตารางอ่าน dailyPlan จาก localStorage
  const [dailyPlan, setDailyPlan] = useState(() => {
    const savedPlan = localStorage.getItem('pnc_study_plan');
    return savedPlan ? JSON.parse(savedPlan) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakQuote, setBreakQuote] = useState('');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [totalTopics, setTotalTopics] = useState('');
  const [completedTopics, setCompletedTopics] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  // Sync กับ LocalStorage อัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('pnc_study_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('pnc_study_hours', JSON.stringify(hoursPerDay));
  }, [hoursPerDay]);

  useEffect(() => {
    localStorage.setItem('pnc_study_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  const handleOpenBreakModal = () => {
    const randomIndex = Math.floor(Math.random() * HEALING_QUOTES.length);
    setBreakQuote(HEALING_QUOTES[randomIndex]);
    setShowBreakModal(true);
  };

  const handleSubmitSubject = (e) => {
    e.preventDefault();
    if (!name.trim() || !totalTopics) return;

    const parsedTotal = Math.max(1, Number(totalTopics) || 1);
    const parsedCompleted = Math.min(Math.max(0, Number(completedTopics) || 0), parsedTotal);

    if (isEditing) {
      setSubjects(prev => prev.map(sub => sub.id === currentId ? {
        ...sub,
        name: name.trim(),
        examDate: examDate || 'ไม่ระบุ',
        totalTopics: parsedTotal,
        completedTopics: parsedCompleted,
        difficulty
      } : sub));
    } else {
      const newSubject = {
        id: Date.now(),
        name: name.trim(),
        examDate: examDate || 'ไม่ระบุ',
        totalTopics: parsedTotal,
        completedTopics: parsedCompleted,
        difficulty
      };
      setSubjects(prev => [...prev, newSubject]);
    }

    resetForm();
    setActiveTab('dashboard');
  };

  const handleEditClick = (sub) => {
    setIsEditing(true);
    setCurrentId(sub.id);
    setName(sub.name);
    setExamDate(sub.examDate === 'ไม่ระบุ' ? '' : sub.examDate);
    setTotalTopics(sub.totalTopics.toString());
    setCompletedTopics(sub.completedTopics.toString());
    setDifficulty(sub.difficulty || 'Medium');
    setActiveTab('add');
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setExamDate('');
    setTotalTopics('');
    setCompletedTopics('');
    setDifficulty('Medium');
  };

  const deleteSubject = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateProgress = (id, delta) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        const updated = Math.min(Math.max(0, sub.completedTopics + delta), sub.totalTopics);
        return { ...sub, completedTopics: updated };
      }
      return sub;
    }));
  };

  // จัดตารางอ่าน (คัดเลือกเฉพาะวิชาที่ยังอ่านไม่ครบเท่านั้น)
  const generateBalancedSchedule = () => {
    if (subjects.length === 0) return alert("กรุณาเพิ่มวิชาก่อนทำการจัดตารางครับ");

    // กรองเอาเฉพาะวิชาที่อ่านยังไม่ครบ (completedTopics < totalTopics)
    const uncompleted = subjects.filter(s => s.completedTopics < s.totalTopics);
    
    if (uncompleted.length === 0) {
      setDailyPlan([]);
      return alert("คุณอ่านจบครบทุกวิชาแล้ว! ยินดีด้วยครับ 🎉");
    }

    const days = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'];
    
    const hardSubs = uncompleted.filter(s => s.difficulty === 'Hard');
    const easyMedSubs = uncompleted.filter(s => s.difficulty !== 'Hard');

    let hardIdx = 0;
    let easyIdx = 0;

    const schedule = days.map((dayName) => {
      let selectedForDay = [];

      if (hardSubs.length > 0) {
        selectedForDay.push(hardSubs[hardIdx % hardSubs.length]);
        hardIdx++;
      }

      if (easyMedSubs.length > 0) {
        selectedForDay.push(easyMedSubs[easyIdx % easyMedSubs.length]);
        easyIdx++;
      }

      while (selectedForDay.length < Math.min(3, uncompleted.length)) {
        const candidate = uncompleted[(hardIdx + easyIdx) % uncompleted.length];
        if (!selectedForDay.some(s => s.id === candidate.id)) {
          selectedForDay.push(candidate);
        }
        easyIdx++;
      }

      const totalAvailable = Number(hoursPerDay) || 4;
      const count = selectedForDay.length;
      const hoursPerSub = Math.min(2, Math.max(1, +(totalAvailable / count).toFixed(1)));

      return {
        day: dayName,
        items: selectedForDay.map(sub => ({
          subjectId: sub.id,
          name: sub.name,
          difficulty: sub.difficulty,
          allocatedHours: hoursPerSub,
          topicsSuggested: Math.max(1, Math.round(hoursPerSub * 1.5))
        }))
      };
    });

    setDailyPlan(schedule);
    setActiveTab('schedule');
  };

  // ฟังก์ชันสลับวิชา
  const handleSwapSubject = (dayIndex, itemIndex) => {
    const uncompleted = subjects.filter(s => s.completedTopics < s.totalTopics);
    if (uncompleted.length <= 1) return alert("ไม่มีวิชาอื่นที่ยังอ่านไม่เสร็จให้สลับแล้วครับ");

    const currentDayItems = dailyPlan[dayIndex].items;
    const currentSubId = currentDayItems[itemIndex].subjectId;

    const availablePool = uncompleted.filter(s => !currentDayItems.some(item => item.subjectId === s.id));
    const newSub = availablePool.length > 0 
      ? availablePool[Math.floor(Math.random() * availablePool.length)]
      : uncompleted.find(s => s.id !== currentSubId);

    const updatedPlan = [...dailyPlan];
    const targetItem = updatedPlan[dayIndex].items[itemIndex];

    updatedPlan[dayIndex].items[itemIndex] = {
      ...targetItem,
      subjectId: newSub.id,
      name: newSub.name,
      difficulty: newSub.difficulty
    };

    setDailyPlan(updatedPlan);
  };

  // กรองตารางการอ่านอัตโนมัติ: ถ้าวิชาไหนอ่านครบแล้ว ให้ตัดออกจากตารางการอ่านทันที
  const activeSubjectIds = new Set(subjects.filter(s => s.completedTopics < s.totalTopics).map(s => s.id));
  const filteredDailyPlan = dailyPlan.map(dayPlan => ({
    ...dayPlan,
    items: dayPlan.items.filter(item => activeSubjectIds.has(item.subjectId))
  })).filter(dayPlan => dayPlan.items.length > 0);

  const totalTopicsCount = subjects.reduce((sum, s) => sum + s.totalTopics, 0);
  const totalCompletedCount = subjects.reduce((sum, s) => sum + s.completedTopics, 0);
  const overallProgress = totalTopicsCount > 0 ? Math.round((totalCompletedCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-8 font-sans pb-36 md:pb-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
              <BookOpen size={22} />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">PNC Study Planner</h1>
              <p className="text-[11px] md:text-sm text-slate-400 font-medium">บันทึกข้อมูลอัตโนมัติด้วย LocalStorage</p>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <button 
              onClick={handleOpenBreakModal}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200/80 rounded-2xl py-2 px-3 flex items-center gap-1.5 font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
            >
              <span>🍿</span> ขอพักผ่อน
            </button>
          )}
        </header>

        {/* TAB 1: หน้าหลัก */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100 relative">
              <p className="text-[11px] font-semibold text-white/80 mb-2 flex items-center gap-1">
                กำลังใจประจำวัน <Heart size={12} className="fill-white" />
              </p>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm md:text-base font-bold leading-relaxed">
                  {HEALING_QUOTES[quoteIndex]}
                </p>
                <button 
                  onClick={() => setQuoteIndex((prev) => (prev + 1) % HEALING_QUOTES.length)}
                  className="p-1.5 hover:bg-white/20 rounded-xl transition shrink-0"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700">ความคืบหน้ารวม</span>
                <span className="text-sm font-extrabold text-indigo-600">{overallProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-5">
                <div className="bg-indigo-600 h-full transition-all duration-300 rounded-full" style={{ width: `${overallProgress}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Target size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">อ่านแล้ว</p>
                    <p className="text-xs font-extrabold text-slate-800">{totalCompletedCount} / {totalTopicsCount} หัวข้อ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">วิชาทั้งหมด</p>
                    <p className="text-xs font-extrabold text-slate-800">{subjects.length} วิชา</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-slate-700">วิชาทั้งหมด ({subjects.length})</h3>
                {subjects.length > 0 && (
                  <button 
                    onClick={generateBalancedSchedule}
                    className="text-xs text-indigo-600 font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                  >
                    <Sparkles size={12} /> จัดตาราง 2-3 วิชา/วัน
                  </button>
                )}
              </div>

              {subjects.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/60 shadow-sm">
                  <BookOpen size={28} className="mx-auto text-indigo-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">ยังไม่มีข้อมูลวิชา</p>
                  <p className="text-xs text-slate-400 mb-4">กดปุ่ม + ด้านล่างเพื่อเริ่มเพิ่มวิชาเรียน</p>
                  <button 
                    onClick={() => { resetForm(); setActiveTab('add'); }}
                    className="py-2 px-4 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    + เพิ่มวิชาใหม่
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {subjects.map((sub) => {
                    const subProgress = sub.totalTopics > 0 ? Math.round((sub.completedTopics / sub.totalTopics) * 100) : 0;
                    const isCompleted = sub.completedTopics >= sub.totalTopics;

                    return (
                      <div key={sub.id} className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-3 ${isCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200/70'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-sm truncate ${isCompleted ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>{sub.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-slate-50 text-slate-600 border-slate-200">
                              {sub.difficulty}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                อ่านจบแล้ว 🎉
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                            <span><Calendar size={11} className="inline mr-1" />{sub.examDate}</span>
                            <span>•</span>
                            <span>{sub.completedTopics}/{sub.totalTopics} หัวข้อ</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'} h-full rounded-full transition-all duration-300`} style={{ width: `${subProgress}%` }}></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => updateProgress(sub.id, -1)} className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-xs active:scale-95">-</button>
                          <button onClick={() => updateProgress(sub.id, 1)} className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs active:scale-95">+</button>
                          <button onClick={() => handleEditClick(sub)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit3 size={15} /></button>
                          <button onClick={() => deleteSubject(sub.id)} className="p-1.5 text-slate-300 hover:text-rose-500"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: หน้าเพิ่ม/แก้ไขวิชา */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/60 animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
              {isEditing ? <Edit3 size={18} className="text-amber-500" /> : <Plus size={18} className="text-indigo-600" />} 
              {isEditing ? 'แก้ไขข้อมูลวิชา' : 'เพิ่มวิชาเตรียมสอบใหม่'}
            </h2>

            <form onSubmit={handleSubmitSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อวิชา / หนังสือ</label>
                <input 
                  type="text" 
                  placeholder="เช่น ชีววิทยา ม.6"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm outline-none focus:border-indigo-500 focus:bg-white transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">วันสอบ</label>
                  <input 
                    type="date" 
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-xs outline-none focus:border-indigo-500 text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ระดับความยาก</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-xs outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="Easy">🟢 ง่าย (Easy)</option>
                    <option value="Medium">🟡 ปานกลาง (Medium)</option>
                    <option value="Hard">🔴 ยาก (Hard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อทั้งหมด</label>
                  <input 
                    type="number" 
                    placeholder="เช่น 10"
                    value={totalTopics}
                    onChange={(e) => setTotalTopics(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm outline-none focus:border-indigo-500"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">อ่านแล้ว (หัวข้อ)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={completedTopics}
                    onChange={(e) => setCompletedTopics(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-sm outline-none focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => { resetForm(); setActiveTab('dashboard'); }}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-3 ${isEditing ? 'bg-amber-500' : 'bg-indigo-600'} text-white font-bold rounded-2xl shadow-md text-xs`}
                >
                  {isEditing ? 'อัปเดตข้อมูล' : 'บันทึกวิชา'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: หน้าตารางอ่านหนังสือ */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-indigo-900">
              <Lightbulb size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">ระบบลบวิชาที่อ่านจบให้อัตโนมัติ!</p>
                <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                  วิชาใดที่อ่านครบทุกหัวข้อ (100%) จะถูกตัดออกจากตารางการอ่านนี้โดยอัตโนมัติ เพื่อให้คุณโฟกัสวิชาที่เหลือครับ
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-slate-700 shadow-sm">
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-500" /> เวลาอ่านหนังสือรวมต่อวัน</span>
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                <input 
                  type="number" 
                  value={hoursPerDay} 
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-8 text-center font-extrabold text-slate-900 text-sm outline-none bg-transparent"
                  min="1"
                  max="12"
                />
                <span className="text-slate-400">ชม./วัน</span>
              </div>
            </div>

            <button 
              onClick={generateBalancedSchedule}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles size={15} /> คำนวณตารางอ่านใหม่
            </button>

            {/* แสดงตารางอ่าน (เฉพาะวิชาที่ยังอ่านไม่จบ) */}
            {filteredDailyPlan.length > 0 ? (
              <div className="space-y-3">
                {filteredDailyPlan.map((dayPlan, dIdx) => (
                  <div key={dIdx} className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                      <span className="font-black text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {dayPlan.day}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {dayPlan.items.length} วิชา
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayPlan.items.map((item, iIdx) => (
                        <div key={iIdx} className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-bold text-xs text-slate-800 truncate">{item.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${item.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {item.difficulty}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              ⏱️ {item.allocatedHours} ชม. | แนะนำ {item.topicsSuggested} หัวข้อ
                            </p>
                          </div>

                          <button 
                            onClick={() => handleSwapSubject(dIdx, iIdx)}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95 transition shrink-0"
                          >
                            <Shuffle size={12} className="text-indigo-500" /> สลับวิชา
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/60 shadow-sm">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-bold text-slate-700 mb-1">ไม่มีวิชาค้างอ่านในตาราง</p>
                <p className="text-xs text-slate-400">คุณอ่านครบทุกวิชาแล้ว หรือยังไม่ได้สร้างตารางอ่าน กดปุ่มคำนวณด้านบนเพื่อเริ่มสร้างใหม่ได้เลยครับ</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-2 z-40 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-400 font-medium'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-1">หน้าหลัก</span>
          </button>

          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${activeTab === 'add' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-400 font-medium'}`}
          >
            <Plus size={20} />
            <span className="text-[10px] mt-1">เพิ่มวิชา</span>
          </button>

          <button 
            onClick={() => { if(dailyPlan.length === 0) generateBalancedSchedule(); else setActiveTab('schedule'); }}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition ${activeTab === 'schedule' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-400 font-medium'}`}
          >
            <CalendarDays size={20} />
            <span className="text-[10px] mt-1">ตารางอ่าน</span>
          </button>
        </div>
      </div>

      {/* Pop-up Modal พักผ่อน */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-amber-100/60 relative overflow-hidden">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-rose-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Sun size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">วันนี้ขอพักผ่อนชาร์จพลัง ✨</h3>
            <p className="text-xs text-slate-400 mb-4">เซฟพลังใจ ปล่อยวางเรื่องเครียดไว้ข้างหลังนะ</p>
            <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl mb-5">
              <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{breakQuote}"</p>
            </div>
            <button 
              onClick={() => setShowBreakModal(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-2xl text-xs shadow-md"
            >
              <Smile size={16} className="inline mr-1" /> รับพลังใจ แล้วไปพักผ่อนกัน
            </button>
          </div>
        </div>
      )}

    </div>
  );
}