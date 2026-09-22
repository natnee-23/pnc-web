import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, RefreshCw, Heart, 
  Target, Layers, Plus, Clock, Trash2, Calendar, Edit3,
  LayoutDashboard, CalendarDays, CheckCircle2, Shuffle, Lightbulb,
  Crown, Users, ChevronRight, Check, AlertCircle, X
} from 'lucide-react';

const HEALING_QUOTES = [
  "การพักผ่อนไม่ใช่เรื่องผิด วันนี้เซฟพลังใจ แล้วค่อยไปต่อพรุ่งนี้นะ ✨",
  "เหนื่อยได้ แต่อย่าเท 😮‍💨",
  "🌙 เหนื่อยตอนนี้ ดีกว่าเสียดายทีหลัง",
  "🧠 สมองยังไหว ไปต่ออีกนิด",
  "📚 อ่านนิดเดียว ยังดีกว่าไม่อ่าน",
  "🎯 คะแนนไม่ได้มาเพราะดวงนะ",
  "ไม่ว่าจะเจอเรื่องแย่แค่ไหนมา เก่งมากแล้วนะที่ผ่านมันมาได้ 🤍",
  "ก้าวทีละนิด ก็เข้าใกล้ความสำเร็จไปอีกขั้น ไม่ต้องรีบแข่งกับใครเลย 🌟",
  "📖 เปิดหนังสือ = ชนะไปหนึ่งขั้น 🏆",
  "ถ้าเหนื่อยก็พักสักหน่อย สมองและหัวใจของคุณต้องการการดูแลนะ 🔋",
  "วันนี้ทำได้แค่นี้ก็ไม่เป็นไรเลย คุณเต็มที่ในแบบของคุณแล้ว 👍",
  "อย่าลืมใจดีกับตัวเองให้มากๆ นะ วันนี้คุณเก่งที่สุดแล้ว ✨",
  "📚 อ่านก่อน เดี๋ยวเก่งเอง ✨",
  "💪 วันนี้ไม่เก่งไม่เป็นไร แต่อย่าหยุด",
];

const formatDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatThaiDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const todayStr = formatDateKey(new Date());
  
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  const formatted = date.toLocaleDateString('th-TH', options);
  
  if (dateStr === todayStr) {
    return `วันนี้ (${formatted})`;
  }
  return formatted;
};

const getDaysUntilExam = (examDateStr) => {
  if (!examDateStr || examDateStr === 'ไม่ระบุ') return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const examDate = new Date(examDateStr + 'T00:00:00');
  const diffTime = examDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function App() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('pnc_study_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [hoursPerDay, setHoursPerDay] = useState(() => {
    const savedHours = localStorage.getItem('pnc_study_hours');
    return savedHours ? JSON.parse(savedHours) : 4;
  });

  const [dailyPlan, setDailyPlan] = useState(() => {
    const savedPlan = localStorage.getItem('pnc_study_plan');
    return savedPlan ? JSON.parse(savedPlan) : [];
  });

  const [isPremium, setIsPremium] = useState(() => {
    const saved = localStorage.getItem('pnc_is_premium');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [userCount, setUserCount] = useState(0);
  const [isLoadingCounter, setIsLoadingCounter] = useState(true);

  // Visitor Counter: นับใหม่ทุกครั้งที่เปิดเว็บหรือ Refresh
  useEffect(() => {
    const savedCount = localStorage.getItem('pnc_visitor_count');

    const currentCount = savedCount
      ? parseInt(savedCount, 10)
      : 100;

    const newCount = currentCount + 1;

    localStorage.setItem(
      'pnc_visitor_count',
      newCount.toString()
    );

    setVisitorCount(newCount);
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [breakQuote, setBreakQuote] = useState('');

  const [swapTarget, setSwapTarget] = useState(null);
  const [manualSelectSubjectId, setManualSelectSubjectId] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [totalTopics, setTotalTopics] = useState('');
  const [completedTopics, setCompletedTopics] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  useEffect(() => {
    localStorage.setItem('pnc_study_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('pnc_study_hours', JSON.stringify(hoursPerDay));
  }, [hoursPerDay]);

  useEffect(() => {
    localStorage.setItem('pnc_study_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  useEffect(() => {
    localStorage.setItem('pnc_is_premium', JSON.stringify(isPremium));
  }, [isPremium]);

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

  const generateBalancedSchedule = () => {
    if (subjects.length === 0) return alert("กรุณาเพิ่มวิชาก่อนทำการจัดตาราง");

    const uncompleted = subjects.filter(s => s.completedTopics < s.totalTopics);
    if (uncompleted.length === 0) {
      setDailyPlan([]);
      return alert("คุณอ่านจบครบทุกวิชาแล้ว! ยินดีด้วย🎉");
    }

    const today = new Date();
    const hardSubs = uncompleted.filter(s => s.difficulty === 'Hard');
    const easyMedSubs = uncompleted.filter(s => s.difficulty !== 'Hard');

    let hardIdx = 0;
    let easyIdx = 0;

    const schedule = Array.from({ length: 7 }).map((_, i) => {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateStr = formatDateKey(currentDate);

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
        date: dateStr,
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

  const openSwapModal = (targetDate, itemIndex, item) => {
    setSwapTarget({ targetDate, itemIndex, item });
    setManualSelectSubjectId('');
  };

  const executeSwapSubject = (selectedSubId = null) => {
    if (!swapTarget) return;

    const { targetDate, itemIndex } = swapTarget;
    const uncompleted = subjects.filter(s => s.completedTopics < s.totalTopics);
    
    if (uncompleted.length <= 1) {
      alert("ไม่มีวิชาอื่นที่ยังอ่านไม่เสร็จให้สลับแล้ว");
      setSwapTarget(null);
      return;
    }

    const realDayIdx = dailyPlan.findIndex(d => d.date === targetDate);
    if (realDayIdx === -1) {
      setSwapTarget(null);
      return;
    }

    const currentDayItems = dailyPlan[realDayIdx].items;
    const currentSubId = currentDayItems[itemIndex]?.subjectId;

    let newSub = null;

    if (selectedSubId) {
      newSub = uncompleted.find(s => s.id === Number(selectedSubId));
    } else {
      const availablePool = uncompleted.filter(s => !currentDayItems.some(item => item.subjectId === s.id));
      newSub = availablePool.length > 0 
        ? availablePool[Math.floor(Math.random() * availablePool.length)]
        : uncompleted.find(s => s.id !== currentSubId);
    }

    if (!newSub) {
      setSwapTarget(null);
      return;
    }

    let updatedPlan = JSON.parse(JSON.stringify(dailyPlan));
    updatedPlan[realDayIdx].items[itemIndex] = {
      ...updatedPlan[realDayIdx].items[itemIndex],
      subjectId: newSub.id,
      name: newSub.name,
      difficulty: newSub.difficulty
    };

    setDailyPlan(updatedPlan);
    setSwapTarget(null);
  };

  const todayStr = formatDateKey(new Date());
  const activeSubjectIds = new Set(subjects.filter(s => s.completedTopics < s.totalTopics).map(s => s.id));

  const filteredDailyPlan = dailyPlan
    .filter(dayPlan => dayPlan.date >= todayStr)
    .map(dayPlan => ({
      ...dayPlan,
      items: dayPlan.items.filter(item => activeSubjectIds.has(item.subjectId))
    }))
    .filter(dayPlan => dayPlan.items.length > 0);

  const totalTopicsCount = subjects.reduce((sum, s) => sum + s.totalTopics, 0);
  const totalCompletedCount = subjects.reduce((sum, s) => sum + s.completedTopics, 0);
  const overallProgress = totalTopicsCount > 0 ? Math.round((totalCompletedCount / totalTopicsCount) * 100) : 0;

  const urgentExams = subjects
    .map(s => ({ ...s, daysLeft: getDaysUntilExam(s.examDate) }))
    .filter(s => s.daysLeft !== null && s.daysLeft >= 0 && s.daysLeft <= 3 && s.completedTopics < s.totalTopics)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-8 font-sans pb-36 md:pb-16">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col gap-3 mb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
                <BookOpen size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">PNC Study Planner</h1>
                  {isPremium ? (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
                      <Crown size={11} className="fill-amber-500 text-amber-600" /> PREMIUM
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      FREE TRIAL
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isPremium && (
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl py-2 px-3 flex items-center gap-1.5 font-bold text-xs shadow-md transition active:scale-95"
                >
                  <Crown size={14} /> อัปเกรด
                </button>
              )}

              {activeTab === 'dashboard' && (
                <button 
                  onClick={handleOpenBreakModal}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200/80 rounded-2xl py-2 px-3 flex items-center gap-1.5 font-bold text-xs shadow-sm transition active:scale-95"
                >
                  <span>🍿</span> ขอพักผ่อน
                </button>
              )}
            </div>
          </div>

          <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-2.5 px-4 flex items-center justify-between text-xs text-slate-600 shadow-sm">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-indigo-600" />
              <span>
                ผู้ใช้งานทั้งหมด: {' '}
                <strong className="text-slate-900 font-extrabold">
                  {isLoadingCounter ? 'กำลังโหลด...' : userCount.toLocaleString()}
                </strong> คน
              </span>
            </div>
            {!isPremium ? (
              <button 
                onClick={() => setShowPremiumModal(true)}
                className="text-amber-600 hover:text-amber-700 font-bold text-[11px] flex items-center gap-1 underline underline-offset-2"
              >
                เปิดใช้งานฟรี สั่งซื้อพรีเมียม <ChevronRight size={12} />
              </button>
            ) : (
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <Check size={12} /> เปิดใช้งานฟีเจอร์พรีเมียมครบแล้ว
              </span>
            )}
          </div>

          {urgentExams.length > 0 && (
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 flex items-start gap-2 text-xs text-rose-900 animate-pulse">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-rose-800">⚠️ มีวิชาใกล้สอบด่วน!</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {urgentExams.map(ex => (
                    <span key={ex.id} className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-lg border border-rose-200 text-[11px]">
                      {ex.name} ({ex.daysLeft === 0 ? 'สอบวันนี้!' : `อีก ${ex.daysLeft} วัน`})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* TAB 1: DASHBOARD */}
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
                  aria-label="สุ่มโควทใหม่"
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
                    className="text-xs text-indigo-600 font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition"
                  >
                    <Sparkles size={12} /> จัดตาราง 7 วันล่วงหน้า
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
                    const daysLeft = getDaysUntilExam(sub.examDate);

                    return (
                      <div key={sub.id} className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-3 ${isCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200/70'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <h4 className={`font-bold text-sm truncate ${isCompleted ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>{sub.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-slate-50 text-slate-600 border-slate-200">
                              {sub.difficulty}
                            </span>

                            {daysLeft !== null && (
                              daysLeft < 0 ? (
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">สอบแล้ว</span>
                              ) : daysLeft === 0 ? (
                                <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">🔥 สอบวันนี้!</span>
                              ) : daysLeft <= 3 ? (
                                <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">🚨 อีก {daysLeft} วัน</span>
                              ) : daysLeft <= 7 ? (
                                <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">⏳ อีก {daysLeft} วัน</span>
                              ) : (
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold">🗓️ อีก {daysLeft} วัน</span>
                              )
                            )}

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
                          <button onClick={() => updateProgress(sub.id, -1)} className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-xs active:scale-95 text-slate-700 hover:bg-slate-200">-</button>
                          <button onClick={() => updateProgress(sub.id, 1)} className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs active:scale-95 hover:bg-indigo-100">+</button>
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

        {/* TAB 2: ADD/EDIT */}
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
                  placeholder="เช่น Calculus"
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
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-xs outline-none focus:border-indigo-500 font-bold text-slate-700"
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
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-200 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-3 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold rounded-2xl shadow-md text-xs transition`}
                >
                  {isEditing ? 'อัปเดตข้อมูล' : 'บันทึกวิชา'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-indigo-900">
              <Lightbulb size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">ระบบจัดตารางอ่านหนังสืออัจฉริยะ</p>
                <p className="text-indigo-700 text-[11px]">
                  คำนวณตามเวลาอ่านคงเหลือจริง กระจายวิชาตามระดับความยากไม่ให้สมองล้าเกินไป
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">เวลาอ่านรวมต่อวัน:</span>
                <input 
                  type="number" 
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Math.max(1, Math.min(16, Number(e.target.value) || 1)))}
                  className="w-16 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 text-center font-bold text-xs text-indigo-600 focus:bg-white outline-none"
                  min="1"
                  max="16"
                />
                <span className="text-xs text-slate-500 font-medium">ชั่วโมง</span>
              </div>
              
              <button 
                onClick={generateBalancedSchedule}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <RefreshCw size={14} /> คำนวณตารางใหม่
              </button>
            </div>

            {filteredDailyPlan.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/60 shadow-sm">
                <CalendarDays size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">ยังไม่มีตารางอ่านหนังสือ</p>
                <p className="text-xs text-slate-400 mb-4">กดปุ่มจัดตารางเพื่อคำนวณแผนอ่านหนังสือ 7 วันล่วงหน้า</p>
                <button 
                  onClick={generateBalancedSchedule}
                  className="py-2.5 px-4 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  ✨ สั่งจัดตารางอ่านหนังสือ
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDailyPlan.map((dayPlan) => (
                  <div key={dayPlan.date} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <Calendar size={13} className="text-indigo-600" />
                        {formatThaiDate(dayPlan.date)}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {dayPlan.items.reduce((sum, item) => sum + item.allocatedHours, 0)* 10/10} ชม.
                      </span>
                    </div>

                    <div className="p-3 space-y-2">
                      {dayPlan.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white border text-slate-500 font-bold">{item.difficulty}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              อ่านประมาณ <strong className="text-slate-600">{item.allocatedHours} ชม.</strong> (~{item.topicsSuggested} หัวข้อ)
                            </p>
                          </div>

                          <button 
                            onClick={() => openSwapModal(dayPlan.date, itemIndex, item)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition shrink-0"
                            title="สลับวิชา"
                          >
                            <Shuffle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* NAVBAR BOTTOM */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg z-40">
        <div className="max-w-3xl mx-auto w-full flex justify-around items-center px-2 py-2">
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 max-w-[120px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>หน้าหลัก</span>
          </button>

          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }}
            className={`flex-1 max-w-[120px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'add' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus size={16} />
            <span>เพิ่มวิชา</span>
          </button>

          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 max-w-[120px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'schedule' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarDays size={16} />
            <span>ตารางอ่าน</span>
          </button>

        </div>
      </nav>

      {/* MODAL 1: BREAK QUOTE */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🍿
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">พักผ่อนสักครู่นะ</h3>
              <p className="text-xs text-slate-500 mt-1">ชาร์จพลังแล้วค่อยกลับมาสู้ต่อ!</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-900 font-bold text-sm leading-relaxed">
              "{breakQuote}"
            </div>
            <button 
              onClick={() => setShowBreakModal(false)}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-slate-800 transition"
            >
              รับทราบ ลุยต่อ! 🚀
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: SWAP SUBJECT */}
      {swapTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <Shuffle size={16} className="text-indigo-600" /> สลับวิชาในตาราง
              </h3>
              <button onClick={() => setSwapTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              วิชาปัจจุบัน: <strong className="text-slate-800">{swapTarget.item.name}</strong>
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => executeSwapSubject(null)}
                className="w-full py-2.5 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Sparkles size={14} /> ให้ระบบสุ่มวิชาอื่นให้แทน
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] font-bold text-slate-400">หรือเลือกวิชาเอง</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <select 
                value={manualSelectSubjectId}
                onChange={(e) => setManualSelectSubjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="">-- เลือกวิชาที่ต้องการ --</option>
                {subjects
                  .filter(s => s.completedTopics < s.totalTopics)
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.difficulty})</option>
                  ))
                }
              </select>

              <button 
                disabled={!manualSelectSubjectId}
                onClick={() => executeSwapSubject(manualSelectSubjectId)}
                className="w-full py-2.5 bg-indigo-600 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition"
              >
                ยืนยันการเลือก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PREMIUM */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Crown size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">PNC Study Planner Premium</h3>
              <p className="text-xs text-slate-500 mt-1">ปลดล็อกฟีเจอร์การเรียนครบวงจร</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 text-left space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>จัดตารางเรียนไม่อั้น</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>ระบบสลับวิชาอัจฉริยะ</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>แจ้งเตือนวิชาใกล้สอบด่วน</span>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  setIsPremium(false);
                  setShowPremiumModal(false);
                }}
                className="w-full py-2.5 bg-rose-50 text-rose-600 font-bold rounded-2xl text-xs hover:bg-rose-100 transition border border-rose-100"
              >
                ยกเลิกสถานะ Premium
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}