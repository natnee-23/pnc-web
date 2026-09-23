import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Shuffle, 
  Check, 
  X, 
  Heart, 
  LayoutDashboard, 
  CalendarDays, 
  Plus, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Copy, 
  Clock4,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const ENCOURAGEMENT_QUOTES = [
  "ก้าวเล็ก ๆ ในวันนี้ คือความสำเร็จที่ยิ่งใหญ่ในวันข้างหน้า ✌️",
  "อย่าเพิ่งท้อนะ! สมองของคุณกำลังเติบโตและจดจำสิ่งดีๆ อยู่",
  "ความพยายามไม่เคยทำร้ายคนตั้งใจ สู้เขา! 🔥",
  "พักสายตาสักแป๊บ แล้วกลับมาลุยต่อ คุณทำได้แน่นอน!",
  "การอ่านหนังสือวันละนิด ดีกว่าการอัดอ่านคืนเดียวนะ",
  "คุณใกล้ถึงเป้าหมายขึ้นไปอีกขั้นแล้วในวันนี้ ✨",
  "ผลลัพธ์ของการตั้งใจ จะทำให้คุณภูมิใจในตัวเองที่สุด",
  "ไม่มีความพยายามใดที่สูญเปล่า เชื่อมั่นในตัวเองเข้าไว้!",
  "สู้ๆ นะคนเก่ง! วางแผนดี มีชัยไปกว่าครึ่ง 🧠",
  "อ่านได้เท่าไหนก็คือเก่งมากแล้ว ค่อยๆ ลุยไปทีละหัวข้อนะ"
];

const getTodayString = () => new Date().toISOString().split('T')[0];

const getFutureDateString = (daysToAdd) => {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
};

export default function StudyPlannerApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // โหลดค่าจาก localStorage (รักษาข้อมูลเดิมไว้เสมอ)
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('user_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('user_completed_tasks');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [dailyPlan, setDailyPlan] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(ENCOURAGEMENT_QUOTES[0]);

  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('ปานกลาง');
  const [formExamDate, setFormExamDate] = useState(getFutureDateString(7));
  const [formTotalTopics, setFormTotalTopics] = useState(5);

  const [swapTarget, setSwapTarget] = useState(null);
  const [manualSelectSubjectId, setManualSelectSubjectId] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    getRandomQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem('user_subjects', JSON.stringify(subjects));
    recalculateSchedule(subjects);
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('user_completed_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const getRandomQuote = () => {
    const idx = Math.floor(Math.random() * ENCOURAGEMENT_QUOTES.length);
    setCurrentQuote(ENCOURAGEMENT_QUOTES[idx]);
  };

  const calculateDaysLeft = (examDateStr) => {
    const today = new Date(getTodayString());
    const examDate = new Date(examDateStr);
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    });
  };

  // คำนวณตารางใหม่โดยใช้วิชาและสถิติเดิม
  const recalculateSchedule = (currentSubjects) => {
    const todayStr = getTodayString();
    const today = new Date(todayStr);

    const activeSubjects = currentSubjects.filter(s => 
      s.completedTopics < s.totalTopics && s.examDate >= todayStr
    );

    if (activeSubjects.length === 0) {
      setDailyPlan([]);
      return;
    }

    const sortedSubjects = [...activeSubjects].sort((a, b) => {
      const daysLeftA = calculateDaysLeft(a.examDate);
      const daysLeftB = calculateDaysLeft(b.examDate);
      if (daysLeftA !== daysLeftB) return daysLeftA - daysLeftB;
      
      const diffWeight = { '🔴ยาก': 3, '🟡ปานกลาง': 2, '🟢ง่าย': 1 };
      return diffWeight[b.difficulty] - diffWeight[a.difficulty];
    });

    const newPlan = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const validForDay = sortedSubjects.filter(s => s.examDate >= dateStr);
      if (validForDay.length === 0) break;

      const daySubjects = [];
      const primary = validForDay[i % validForDay.length];
      daySubjects.push(primary);

      if (validForDay.length > 1) {
        const secondary = validForDay[(i + 1) % validForDay.length];
        if (secondary.id !== primary.id) {
          daySubjects.push(secondary);
        }
      }

      const items = daySubjects.map(sub => ({
        subjectId: sub.id,
        name: sub.name,
        difficulty: sub.difficulty,
        examDate: sub.examDate
      }));

      newPlan.push({ date: dateStr, items });
    }

    setDailyPlan(newPlan);
  };

  const toggleTaskCompletion = (dateStr, subjectId) => {
    const taskKey = `${dateStr}-${subjectId}`;
    const isCurrentlyDone = !!completedTasks[taskKey];

    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: !isCurrentlyDone
    }));

    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const delta = !isCurrentlyDone ? 1 : -1;
        const newCompleted = Math.min(s.totalTopics, Math.max(0, s.completedTopics + delta));
        return { ...s, completedTopics: newCompleted };
      }
      return s;
    }));
  };

  // ฟังก์ชันเพิ่มหัวข้ออ่านเกินล่วงหน้า โดยไม่ต้องรีเซ็ตตาราง
  const handleReadExtra = (subjectId) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const newCompleted = Math.min(s.totalTopics, s.completedTopics + 1);
        return { ...s, completedTopics: newCompleted };
      }
      return s;
    }));
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updatedSubjects = [];
    if (editingSubjectId) {
      // แก้ไขวิชาเดิม (คง completedTopics เดิมไว้)
      updatedSubjects = subjects.map(s => s.id === editingSubjectId ? {
        ...s,
        name: formName,
        difficulty: formDifficulty,
        examDate: formExamDate,
        totalTopics: Number(formTotalTopics)
      } : s);
      setEditingSubjectId(null);
    } else {
      // เพิ่มวิชาใหม่ (สะสมเข้ากับวิชาเดิมที่มีอยู่)
      const newSub = {
        id: Date.now().toString(),
        name: formName,
        difficulty: formDifficulty,
        examDate: formExamDate,
        totalTopics: Number(formTotalTopics),
        completedTopics: 0
      };
      updatedSubjects = [...subjects, newSub];
    }

    setSubjects(updatedSubjects);
    resetForm();
    setActiveTab('schedule');
  };

  const startEditSubject = (sub) => {
    setEditingSubjectId(sub.id);
    setFormName(sub.name);
    setFormDifficulty(sub.difficulty);
    setFormExamDate(sub.examDate);
    setFormTotalTopics(sub.totalTopics);
    setActiveTab('add');
  };

  const resetForm = () => {
    setEditingSubjectId(null);
    setFormName('');
    setFormDifficulty('ปานกลาง');
    setFormExamDate(getFutureDateString(7));
    setFormTotalTopics(5);
  };

  const deleteSubject = (id) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
  };

  const adjustProgress = (id, delta) => {
    const updated = subjects.map(s => {
      if (s.id === id) {
        const newProgress = Math.min(s.totalTopics, Math.max(0, s.completedTopics + delta));
        return { ...s, completedTopics: newProgress };
      }
      return s;
    });
    setSubjects(updated);
  };

  const executeSwapSubject = (targetSubjectId) => {
    if (!swapTarget) return;

    const { dayIndex, itemIndex } = swapTarget;
    let replacementSubject;

    if (targetSubjectId) {
      replacementSubject = subjects.find(s => s.id === targetSubjectId);
    } else {
      const candidates = subjects.filter(s => 
        s.id !== swapTarget.item.subjectId && 
        s.completedTopics < s.totalTopics &&
        s.examDate >= dailyPlan[dayIndex].date
      );
      if (candidates.length > 0) {
        replacementSubject = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }

    if (!replacementSubject) {
      alert('ไม่มีวิชาอื่นที่สามารถสลับได้');
      setSwapTarget(null);
      return;
    }

    setDailyPlan(prevPlan => {
      const updated = [...prevPlan];
      updated[dayIndex].items[itemIndex] = {
        subjectId: replacementSubject.id,
        name: replacementSubject.name,
        difficulty: replacementSubject.difficulty,
        examDate: replacementSubject.examDate
      };
      return updated;
    });

    setSwapTarget(null);
  };

  const totalTopicsAll = subjects.reduce((acc, curr) => acc + curr.totalTopics, 0);
  const completedTopicsAll = subjects.reduce((acc, curr) => acc + curr.completedTopics, 0);
  const totalProgressPercent = totalTopicsAll > 0 ? Math.round((completedTopicsAll / totalTopicsAll) * 100) : 0;
  
  const urgentSubjects = [...subjects]
    .filter(s => {
      const daysLeft = calculateDaysLeft(s.examDate);
      return s.completedTopics < s.totalTopics && daysLeft >= 0 && daysLeft <= 7;
    })
    .sort((a, b) => calculateDaysLeft(a.examDate) - calculateDaysLeft(b.examDate));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-md shadow-indigo-100">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-none">PNC Study Planner</h1>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">จัดตารางอ่านหนังสืออัจฉริยะ</p>
            </div>
          </div>

          <button 
            onClick={() => setShowDonateModal(true)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Heart size={14} className="text-amber-600 fill-amber-500" />
            <span>สนับสนุน</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-5">
        {/* หน้าหลัก (Dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                  ✨ กำลังใจวันนี้
                </span>
                <button 
                  onClick={getRandomQuote}
                  className="text-xs font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
                >
                  <Sparkles size={12} /> 🔀
                </button>
              </div>

              <p className="text-sm md:text-base font-bold leading-relaxed pt-1">
                "{currentQuote}"
              </p>
            </div>

            {urgentSubjects.length > 0 && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>วิชาด่วนใกล้สอบ!</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {urgentSubjects.map(sub => {
                    const daysLeft = calculateDaysLeft(sub.examDate);
                    return (
                      <div key={sub.id} className="min-w-[200px] max-w-[220px] bg-white rounded-xl p-3 border border-amber-200/80 shadow-sm flex justify-between items-center shrink-0">
                        <div className="truncate mr-2">
                          <h4 className="font-bold text-xs text-slate-800 truncate">{sub.name}</h4>
                          <span className="text-[10px] text-slate-400">สอบ {formatThaiDate(sub.examDate)}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                          daysLeft <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          เหลือ {daysLeft} วัน
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-slate-700">ความคืบหน้ารวมทุกวิชา</span>
                <span className="text-indigo-600">{completedTopicsAll} / {totalTopicsAll} หัวข้อ ({totalProgressPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${totalProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">วิชาทั้งหมดที่มี ({subjects.length})</h3>
                <button 
                  onClick={() => { resetForm(); setActiveTab('add'); }}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> เพิ่มวิชาใหม่
                </button>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
                  <BookOpen size={32} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-500">ยังไม่มีรายชื่อวิชาในระบบ</p>
                  <button 
                    onClick={() => { resetForm(); setActiveTab('add'); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                  >
                    <Plus size={14} /> เริ่มเพิ่มวิชาแรกของคุณ
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {subjects.map(sub => {
                    const daysLeft = calculateDaysLeft(sub.examDate);
                    const progress = Math.round((sub.completedTopics / sub.totalTopics) * 100);

                    return (
                      <div key={sub.id} className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm space-y-2.5">
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-800">{sub.name}</h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              {sub.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">
                              สอบ {formatThaiDate(sub.examDate)} (เหลือ {daysLeft} วัน)
                            </span>
                            <button 
                              onClick={() => startEditSubject(sub)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => deleteSubject(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 w-12 text-right">
                              {sub.completedTopics}/{sub.totalTopics} ({progress}%)
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => adjustProgress(sub.id, -1)}
                              disabled={sub.completedTopics <= 0}
                              className="w-6 h-6 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg font-bold text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => adjustProgress(sub.id, 1)}
                              disabled={sub.completedTopics >= sub.totalTopics}
                              className="w-6 h-6 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 text-indigo-700 rounded-lg font-bold text-xs flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* หน้าตารางอ่านหนังสือ (Schedule) */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black text-slate-800">ตารางอ่านหนังสือ</h2>
                <p className="text-[11px] text-slate-400">กดอ่านเสร็จแล้ววิชาจะแสดงสถานะเรียบร้อย</p>
              </div>
              <button 
                onClick={() => recalculateSchedule(subjects)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Sparkles size={12} /> คำนวณตารางใหม่
              </button>
            </div>

            {dailyPlan.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3 shadow-sm">
                <Clock4 size={32} className="mx-auto text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">ไม่มีตารางอ่านหนังสือในตอนนี้</h3>
                <p className="text-xs text-slate-400">ลองเพิ่มวิชาเรียนใหม่</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyPlan.map((dayPlan, dayIndex) => (
                  <div key={dayPlan.date} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Calendar size={13} className="text-indigo-600" />
                        {formatThaiDate(dayPlan.date)} {dayPlan.date === getTodayString() && <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">วันนี้</span>}
                      </span>
                    </div>

                    <div className="p-3 space-y-2">
                      {dayPlan.items.map((item, itemIndex) => {
                        const taskKey = `${dayPlan.date}-${item.subjectId}`;
                        const isDone = !!completedTasks[taskKey];
                        const subjectData = subjects.find(s => s.id === item.subjectId);

                        return (
                          <div 
                            key={`${item.subjectId}-${itemIndex}`} 
                            className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
                              isDone 
                                ? 'bg-emerald-50/50 border-emerald-200' 
                                : 'bg-slate-50/60 border-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isDone ? 'text-emerald-800 line-through opacity-70' : 'text-slate-800'}`}>
                                  {item.name}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-white text-slate-500 border border-slate-200">
                                  {item.difficulty}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {!isDone && (
                                  <button 
                                    onClick={() => {
                                      setSwapTarget({ dayIndex, itemIndex, item });
                                      setManualSelectSubjectId('');
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    title="สลับวิชา"
                                  >
                                    <Shuffle size={14} />
                                  </button>
                                )}
                                
                                <button 
                                  onClick={() => toggleTaskCompletion(dayPlan.date, item.subjectId)}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition active:scale-95 border ${
                                    isDone
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                                  }`}
                                >
                                  {isDone ? (
                                    <>
                                      <CheckCircle2 size={13} /> อ่านเรียบร้อยแล้ว
                                    </>
                                  ) : (
                                    <>
                                      <Check size={12} /> เสร็จแล้ว
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* ตัวเลือกพิเศษเมื่ออ่านเสร็จของวันนี้แล้วอยากอ่านเพิ่ม */}
                            {isDone && dayPlan.date === getTodayString() && subjectData && subjectData.completedTopics < subjectData.totalTopics && (
                              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-700">
                                  อ่านของวันนี้ครบแล้ว อยากอ่านต่อล่วงหน้าไหม?
                                </span>
                                <button 
                                  onClick={() => handleReadExtra(item.subjectId)}
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition active:scale-95"
                                >
                                  <span>อ่านล่วงหน้า (+1 หัวข้อ)</span>
                                  <ArrowRight size={10} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* หน้าเพิ่มวิชาใหม่ (Add Subject) */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-sm space-y-4 animate-in fade-in max-w-xl mx-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800">
                {editingSubjectId ? 'แก้ไขข้อมูลวิชา' : 'เพิ่มวิชาใหม่เข้าตาราง'}
              </h2>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">ชื่อวิชา</label>
                <input 
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="เช่น แคลคูลัส 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">ระดับความยาก</label>
                <select 
                  value={formDifficulty}
                  onChange={e => setFormDifficulty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-bold text-slate-700"
                >
                  <option value="🟢ง่าย">🟢ง่าย</option>
                  <option value="🟡ปานกลาง">🟡ปานกลาง</option>
                  <option value="🔴ยาก">🔴ยาก</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">วันสอบ (ปฏิทิน)</label>
                <input 
                  type="date"
                  required
                  min={getTodayString()}
                  value={formExamDate}
                  onChange={e => setFormExamDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">จำนวนหัวข้อทั้งหมดที่จะอ่าน</label>
                <input 
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={formTotalTopics}
                  onChange={e => setFormTotalTopics(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-bold text-slate-700"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => { resetForm(); setActiveTab('dashboard'); }}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  {editingSubjectId ? 'บันทึกการแก้ไข' : 'บันทึกวิชาใหม่'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Modal สลับวิชา */}
      {swapTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Shuffle size={16} className="text-indigo-600" /> สลับวิชาที่จะอ่าน
              </h3>
              <button onClick={() => setSwapTarget(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              ต้องการสลับวิชา <strong className="text-slate-900">{swapTarget.item.name}</strong>
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => executeSwapSubject(null)}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs border border-indigo-200 flex items-center justify-center gap-1.5 transition"
              >
                <Shuffle size={14} /> สุ่มสลับวิชาอัตโนมัติ
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold">หรือเลือกวิชาเอง</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <select 
                value={manualSelectSubjectId}
                onChange={(e) => setManualSelectSubjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-bold text-slate-700"
              >
                <option value="">-- เลือกวิชาที่ต้องการสลับ --</option>
                {subjects
                  .filter(s => s.completedTopics < s.totalTopics && s.id !== swapTarget.item.subjectId)
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.difficulty})</option>
                  ))}
              </select>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setSwapTarget(null)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={() => executeSwapSubject(manualSelectSubjectId)}
                  disabled={!manualSelectSubjectId}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  ยืนยันสลับวิชา
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal โดเนท */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-sm">
                <Heart size={18} className="fill-amber-500" />
                <span>สนับสนุนผู้พัฒนาเว็บ</span>
              </div>
              <button onClick={() => setShowDonateModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              หากแอปนี้ช่วยให้คุณจัดตารางอ่านหนังสือได้ดีขึ้น คุณสามารถร่วมสนับสนุนผู้พัฒนาได้ที่นี่ครับ ☕
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PromptPay</span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">-ปภังกร คาการุณ</span>
              <p className="text-sm font-black text-indigo-600 tracking-wider">0659690021</p>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText('0659690021');
                alert('คัดลอกหมายเลขแล้ว');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Copy size={14} /> คัดลอกเลขบัญชี
            </button>
          </div>
        </div>
      )}

      {/* Taskbar ด้านล่าง - หน้าแรกอยู่ซ้าย | เพิ่มวิชาอยู่กลาง | ตารางอ่านอยู่ขวา */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-around h-16 px-2">
          {/* ซ้าย: หน้าแรก */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition ${
              activeTab === 'dashboard' ? 'text-indigo-600 font-bold border-t-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[11px]">หน้าแรก</span>
          </button>

          {/* ตรงกลาง: เพิ่มวิชา */}
          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition ${
              activeTab === 'add' ? 'text-indigo-600 font-bold border-t-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="bg-indigo-600 text-white p-2 rounded-2xl shadow-md shadow-indigo-200 -mt-2">
              <Plus size={22} />
            </div>
            <span className="text-[11px] font-bold">เพิ่มวิชา</span>
          </button>

          {/* ขวา: ตารางอ่านหนังสือ */}
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition ${
              activeTab === 'schedule' ? 'text-indigo-600 font-bold border-t-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CalendarDays size={20} />
            <span className="text-[11px]">ตารางอ่าน</span>
          </button>
        </div>
      </nav>
    </div>
  );
}