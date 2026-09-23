import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Shuffle, 
  CheckCircle2, 
  X, 
  Heart, 
  LayoutDashboard, 
  CalendarDays, 
  Plus, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Coffee, 
  AlertTriangle, 
  Copy, 
  Clock,
  Clock4
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
  "อ่านได้เท่าไหนก็คือเก่งมากแล้ว ค่อยๆ ลุยไปทีละหัวข้อนะ",
  "เหนื่อยก็พัก แต่อย่าเพิ่งถอยนะ! เติมพลังแล้วลุยต่อ 💪",
  "ทุกๆ หน้าที่อ่านจบ คือคะแนนที่เพิ่มขึ้นในวันสอบ",
  "การลงทุนกับความรู้ ให้ผลตอบแทนคุ้มค่าที่สุดเสมอ",
  "วันนี้ทำเต็มที่แล้ว ถือว่าคุณสุดยอดมาก!",
  "อย่าเปรียบเทียบตัวเองกับใคร แข่งกับตัวเองในเมื่อวานพอ",
  "ฝันให้ไกล แล้วก้าวไปให้ถึง คุณทำได้แน่!",
  "ความอนาคตสดใสรอคนที่ตั้งใจอยู่ในวันนี้",
  "หยุดพักสักครู่ จิบน้ำเย็นๆ ให้สดชื่นแล้วไปต่อกัน 🥤",
  "เชื่อมั่นในศักยภาพของตัวเอง คุณมีพลังมากกว่าที่คิด",
  "อีกนิดเดียวเท่านั้น! อดทนเพื่อเป้าหมายที่ตั้งไว้ ✨"
];

const getTodayString = () => new Date().toISOString().split('T')[0];

const getFutureDateString = (daysToAdd) => {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
};

const INITIAL_SUBJECTS = [
  { id: '1', name: 'แคลคูลัส 1', difficulty: 'ยาก', examDate: getFutureDateString(3), totalTopics: 10, completedTopics: 3 },
  { id: '2', name: 'ฟิสิกส์ทั่วไป', difficulty: 'ปานกลาง', examDate: getFutureDateString(7), totalTopics: 8, completedTopics: 2 },
  { id: '3', name: 'ภาษาอังกฤษเพื่อการสื่อสาร', difficulty: 'ง่าย', examDate: getFutureDateString(12), totalTopics: 6, completedTopics: 4 },
];

export default function StudyPlannerApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [dailyPlan, setDailyPlan] = useState([]);
  
  const [currentQuote, setCurrentQuote] = useState(ENCOURAGEMENT_QUOTES[0]);

  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('ปานกลาง');
  const [formExamDate, setFormExamDate] = useState(getFutureDateString(7));
  const [formTotalTopics, setFormTotalTopics] = useState(5);

  const [swapTarget, setSwapTarget] = useState(null);
  const [manualSelectSubjectId, setManualSelectSubjectId] = useState('');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    getRandomQuote();
  }, []);

  useEffect(() => {
    const today = getTodayString();
    setSubjects(prev => prev.filter(sub => sub.examDate >= today));
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      recalculateSchedule(subjects);
    } else {
      setDailyPlan([]);
    }
  }, [subjects]);

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

  const recalculateSchedule = (currentSubjects, startFromDayIndex = 0, existingPlan = []) => {
    const today = new Date();
    const activeSubjects = currentSubjects.filter(s => 
      s.completedTopics < s.totalTopics && s.examDate >= getTodayString()
    );

    if (activeSubjects.length === 0) {
      setDailyPlan([]);
      return;
    }

    const sortedSubjects = [...activeSubjects].sort((a, b) => {
      const daysLeftA = calculateDaysLeft(a.examDate);
      const daysLeftB = calculateDaysLeft(b.examDate);
      if (daysLeftA !== daysLeftB) return daysLeftA - daysLeftB;
      
      const diffWeight = { 'ยาก': 3, 'ปานกลาง': 2, 'ง่าย': 1 };
      return diffWeight[b.difficulty] - diffWeight[a.difficulty];
    });

    const newPlan = startFromDayIndex > 0 ? [...existingPlan.slice(0, startFromDayIndex)] : [];

    for (let i = startFromDayIndex; i < 7; i++) {
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

      const items = daySubjects.map(sub => {
        const remainingTopics = sub.totalTopics - sub.completedTopics;
        const topicsSuggested = Math.min(2, Math.max(1, remainingTopics));
        const hoursPerTopic = sub.difficulty === 'ยาก' ? 2 : sub.difficulty === 'ปานกลาง' ? 1.5 : 1;
        
        return {
          subjectId: sub.id,
          name: sub.name,
          difficulty: sub.difficulty,
          allocatedHours: topicsSuggested * hoursPerTopic,
          topicsSuggested,
          examDate: sub.examDate
        };
      });

      newPlan.push({ date: dateStr, items });
    }

    setDailyPlan(newPlan);
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingSubjectId) {
      setSubjects(prev => prev.map(s => s.id === editingSubjectId ? {
        ...s,
        name: formName,
        difficulty: formDifficulty,
        examDate: formExamDate,
        totalTopics: Number(formTotalTopics)
      } : s));
      setEditingSubjectId(null);
    } else {
      const newSub = {
        id: Date.now().toString(),
        name: formName,
        difficulty: formDifficulty,
        examDate: formExamDate,
        totalTopics: Number(formTotalTopics),
        completedTopics: 0
      };
      setSubjects(prev => [...prev, newSub]);
    }

    resetForm();
    setActiveTab('dashboard');
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
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const adjustProgress = (id, delta) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const updated = Math.min(s.totalTopics, Math.max(0, s.completedTopics + delta));
        return { ...s, completedTopics: updated };
      }
      return s;
    }));
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

    const updatedPlan = [...dailyPlan];
    const remainingTopics = replacementSubject.totalTopics - replacementSubject.completedTopics;
    const topicsSuggested = Math.min(2, Math.max(1, remainingTopics));
    const hoursPerTopic = replacementSubject.difficulty === 'ยาก' ? 2 : replacementSubject.difficulty === 'ปานกลาง' ? 1.5 : 1;

    updatedPlan[dayIndex].items[itemIndex] = {
      subjectId: replacementSubject.id,
      name: replacementSubject.name,
      difficulty: replacementSubject.difficulty,
      allocatedHours: topicsSuggested * hoursPerTopic,
      topicsSuggested,
      examDate: replacementSubject.examDate
    };

    recalculateSchedule(subjects, dayIndex + 1, updatedPlan);
    setSwapTarget(null);
  };

  const totalTopicsAll = subjects.reduce((acc, curr) => acc + curr.totalTopics, 0);
  const completedTopicsAll = subjects.reduce((acc, curr) => acc + curr.completedTopics, 0);
  const totalProgressPercent = totalTopicsAll > 0 ? Math.round((completedTopicsAll / totalTopicsAll) * 100) : 0;
  
  const urgentSubjects = [...subjects]
    .filter(s => s.completedTopics < s.totalTopics)
    .sort((a, b) => calculateDaysLeft(a.examDate) - calculateDaysLeft(b.examDate));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 font-sans antialiased">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-md shadow-indigo-100">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-none">PNC Study Planner</h1>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">จัดตารางอ่านหนังสืออัจฉริยะ (ใช้งานฟรี)</p>
            </div>
          </div>

          <button 
            onClick={() => setShowDonateModal(true)}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Heart size={14} className="text-amber-600 fill-amber-500" />
            <span>สนับสนุน / โดเนท</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-5">
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-100 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                  ✨ กำลังใจวันนี้
                </span>
                <button 
                  onClick={getRandomQuote}
                  className="text-xs font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
                >
                  <Sparkles size={12} /> สุ่มกำลังใจ
                </button>
              </div>

              <p className="text-sm md:text-base font-bold leading-relaxed">
                "{currentQuote}"
              </p>

              <div className="flex flex-wrap gap-2 pt-1 border-t border-indigo-500/40">
                <button 
                  onClick={() => setShowBreakModal(true)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Coffee size={14} /> ขอพักสายตา
                </button>
                <button 
                  onClick={() => setShowDonateModal(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Heart size={14} className="fill-slate-900" /> สนับสนุนผู้พัฒนา
                </button>
              </div>
            </div>

            {urgentSubjects.length > 0 && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>วิชาด่วนใกล้สอบ! (เรียงลำดับวันคงเหลือ)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {urgentSubjects.slice(0, 3).map(sub => {
                    const daysLeft = calculateDaysLeft(sub.examDate);
                    return (
                      <div key={sub.id} className="bg-white rounded-xl p-3 border border-amber-200/80 shadow-sm flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 truncate">{sub.name}</h4>
                          <span className="text-[10px] text-slate-400">สอบ {formatThaiDate(sub.examDate)}</span>
                        </div>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
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
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-2">
                  <BookOpen size={28} className="mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-500">ยังไม่มีรายชื่อวิชาในระบบ</p>
                  <p className="text-[11px] text-slate-400">กดเพิ่มวิชาเพื่อเริ่มต้นวางแผนอ่านหนังสือได้เลย</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects.map(sub => {
                    const daysLeft = calculateDaysLeft(sub.examDate);
                    const progress = Math.round((sub.completedTopics / sub.totalTopics) * 100);

                    return (
                      <div key={sub.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-800">{sub.name}</h4>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                {sub.difficulty}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <Clock size={11} className="text-indigo-500" /> สอบ {formatThaiDate(sub.examDate)} (เหลือ {daysLeft} วัน)
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => startEditSubject(sub)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                              title="แก้ไขวิชา"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => deleteSubject(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="ลบวิชา"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 font-bold">ความคืบหน้า: {sub.completedTopics}/{sub.totalTopics} หัวข้อ</span>
                            <span className="font-bold text-indigo-600">{progress}%</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black text-slate-800">ตารางอ่านหนังสือตามปฏิทิน</h2>
                <p className="text-[11px] text-slate-400">เน้นวิชาใกล้สอบก่อน อัปเดตลบวิชาอัตโนมัติเมื่อผ่านวันสอบ</p>
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
                <h3 className="text-sm font-bold text-slate-800">ยังไม่มีตารางอ่านหนังสือในตอนนี้</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  อาจเนื่องจากยังไม่มีวิชา หรือวิชาที่มีอยู่สอบเสร็จเรียบร้อยแล้ว
                </p>
                <button
                  onClick={() => { resetForm(); setActiveTab('add'); }}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  + เพิ่มวิชาอ่าน
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyPlan.map((dayPlan, dayIndex) => (
                  <div key={dayPlan.date} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Calendar size={13} className="text-indigo-600" />
                        {formatThaiDate(dayPlan.date)}
                      </span>
                      <span className="text-[10px] bg-slate-200/60 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                        รวมอ่าน ~{dayPlan.items.reduce((acc, curr) => acc + curr.allocatedHours, 0)} ชม.
                      </span>
                    </div>

                    <div className="p-3 divide-y divide-slate-100">
                      {dayPlan.items.map((item, itemIndex) => {
                        const daysLeft = calculateDaysLeft(item.examDate);
                        return (
                          <div key={`${item.subjectId}-${itemIndex}`} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                  {item.difficulty}
                                </span>
                                {daysLeft <= 3 && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-100 text-rose-600 border border-rose-200">
                                    เร่งอ่าน!
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400">
                                อ่าน ~{item.allocatedHours} ชม. (เป้าหมาย {item.topicsSuggested} หัวข้อ) • สอบในอีก {daysLeft} วัน
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
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
                              <button 
                                onClick={() => adjustProgress(item.subjectId, 1)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
                              >
                                <CheckCircle2 size={12} /> เสร็จแล้ว
                              </button>
                            </div>
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

        {activeTab === 'add' && (
          <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-sm space-y-4 animate-in fade-in max-w-xl mx-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800">
                {editingSubjectId ? 'แก้ไขข้อมูลวิชา' : 'เพิ่มวิชาใหม่เข้าตาราง'}
              </h2>
              {editingSubjectId && (
                <button onClick={resetForm} className="text-xs text-slate-400 hover:text-slate-600">
                  ยกเลิกการแก้ไข
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">ชื่อวิชา</label>
                <input 
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="เช่น แคลคูลัส 1, ภาษาอังกฤษ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ระดับความยาก</label>
                  <select 
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-bold text-slate-700"
                  >
                    <option value="ง่าย">ง่าย</option>
                    <option value="ปานกลาง">ปานกลาง</option>
                    <option value="ยาก">ยาก</option>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none font-bold text-slate-700"
                  />
                </div>
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
              สลับวิชา <strong className="text-slate-900">{swapTarget.item.name}</strong> ออกจากตารางวัน
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

      {showBreakModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              🍿
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">ได้เวลาชาร์จแบตแล้ว!</h3>
              <p className="text-xs text-slate-500 mt-1">วางหนังสือลงสักพัก ไปหาของอร่อยกิน หรือพักสายตาดูนะ</p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 text-xs font-bold text-amber-900 leading-relaxed">
              "{currentQuote}"
            </div>

            <button 
              onClick={() => setShowBreakModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs shadow-md transition"
            >
              เข้าใจแล้ว ชาร์จพลังใจเรียบร้อย! ✨
            </button>
          </div>
        </div>
      )}

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
              เว็บนี้เปิดให้ **ใช้งานฟรี 100%** ไม่มีระบบกั๊กฟีเจอร์ หากแอปนี้ช่วยให้คุณจัดตารางอ่านหนังสือได้ดีขึ้น คุณสามารถร่วมเลี้ยงกาแฟ/สนับสนุนผู้พัฒนาได้ที่นี่ครับ ☕
            </p>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PromptPay / ธนาคาร</span>
              <p className="text-sm font-black text-indigo-600 tracking-wider">08X-XXX-XXXX</p>
              <p className="text-[11px] font-bold text-slate-600">ชื่อบัญชี: นายผู้พัฒนา ซัพพอร์ตดี</p>
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText('08XXXXXXXX');
                alert('คัดลอกหมายเลขแล้ว ขอบคุณสำหรับทุกๆ การสนับสนุนครับ!');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Copy size={14} /> คัดลอกเลขบัญชี
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl px-4 py-2 shadow-xl flex items-center gap-4 md:gap-8 z-40">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition ${activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px]">หน้าหลัก</span>
        </button>

        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition ${activeTab === 'schedule' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <CalendarDays size={20} />
          <span className="text-[10px]">ตารางอ่าน</span>
        </button>

        <button 
          onClick={() => { resetForm(); setActiveTab('add'); }}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transition active:scale-95 mx-1"
          title="เพิ่มวิชา"
        >
          <Plus size={24} />
        </button>
      </nav>
    </div>
  );
}