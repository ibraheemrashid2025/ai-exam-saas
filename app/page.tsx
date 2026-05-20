'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ShieldAlert, 
  FileText, 
  BarChart, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  Cpu,
  History,
  Terminal,
  ArrowRight,
  Trash2
} from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum'); 
  const [examData, setExamData] = useState<any>(null);
  
  // Real-time saved sessions storage state
  const [savedSessions, setSavedSessions] = useState<any[]>([]);

  // Load saved data from browser storage on mount
  useEffect(() => {
    const localData = localStorage.getItem('exam_ai_sessions');
    if (localData) {
      setSavedSessions(JSON.parse(localData));
    }
  }, []);

  const handleGenerate = async () => {
    if (!topic) return alert("Please paste the syllabus content first!");
    setLoading(true);
    setExamData(null);

    const currentSessionTitle = sessionName.trim() || `SESSION_${new Date().toLocaleDateString()}`;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, sessionName: currentSessionTitle }),
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        setExamData(data);
        setActiveTab('curriculum'); 

        // Local storage pipeline - Appending new data to the list
        const newSessionItem = {
          id: Date.now().toString(),
          title: currentSessionTitle,
          payloadText: topic,
          timestamp: new Date().toLocaleString(),
          matrixData: data
        };

        const updatedSessions = [newSessionItem, ...savedSessions];
        setSavedSessions(updatedSessions);
        localStorage.setItem('exam_ai_sessions', JSON.stringify(updatedSessions));

      } else {
        alert("Agents encountered an error: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Could not establish a connection with the backend server!");
    } finally {
      setLoading(false);
    }
  };

  // Delete an individual session record
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents loading the session while deleting
    const filtered = savedSessions.filter(item => item.id !== id);
    setSavedSessions(filtered);
    localStorage.setItem('exam_ai_sessions', JSON.stringify(filtered));
    if (examData && savedSessions.find(s => s.id === id)?.matrixData?.sessionName === examData.sessionName) {
      setExamData(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Sidebar - Responsive Navigation (Top layout on mobile, side column on desktop) */}
      <div className="w-full md:w-66 bg-slate-900/60 backdrop-blur-xl border-b md:border-r border-slate-800 p-5 md:p-6 flex flex-col gap-4 md:gap-8 select-none flex-shrink-0">
        
        {/* Tech Branding Logo Area */}
        <div className="flex items-center justify-between md:justify-start gap-3 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="flex items-center justify-center w-full h-full bg-slate-950 rounded-[11px] transition-all group-hover:bg-slate-900">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-90 transition-all duration-500" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                EXAM<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase -mt-1">Core Engine v1.2</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block h-[1px] bg-gradient-to-r from-slate-800 to-transparent" />

        {/* Dynamic Saved History List (Horizontal scroll on mobile, vertical stack on desktop) */}
        <div className="flex flex-col gap-2 md:gap-4 flex-1 overflow-hidden">
          <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
            <History className="w-3 h-3 text-indigo-400" /> Archival Registries
          </div>
          
          <div className="flex flex-row md:flex-col gap-2 text-sm text-slate-400 overflow-x-auto md:overflow-x-visible md:overflow-y-auto pb-2 md:pb-0 scrollbar-none snap-x">
            {savedSessions.length === 0 ? (
              <div className="text-[11px] text-slate-600 border border-dashed border-slate-800 p-3 md:p-4 rounded-xl text-center w-full min-w-[200px]">
                No archived telemetry yet.
              </div>
            ) : (
              savedSessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => {
                    setExamData(session.matrixData);
                    setTopic(session.payloadText);
                    setSessionName(session.title);
                    setActiveTab('curriculum');
                  }}
                  className={`group/item flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all border snap-center flex-shrink-0 min-w-[170px] md:min-w-0 md:w-full ${
                    examData && examData.sessionName === session.title
                      ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30' 
                      : 'border-slate-800/40 bg-slate-900/40 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden truncate">
                    <Terminal className={`w-3.5 h-3.5 flex-shrink-0 ${examData && examData.sessionName === session.title ? 'text-cyan-400' : 'text-slate-600'}`} />
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-xs md:text-sm truncate">{session.title}</span>
                      <span className="text-[9px] text-slate-600 font-mono">{session.timestamp.split(',')[0]}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="md:opacity-0 group-hover/item:opacity-100 p-1 text-slate-600 hover:text-rose-400 transition-all rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl w-full mx-auto flex flex-col gap-6 md:gap-8 overflow-y-auto">
        
        {/* Header Segment */}
        <div className="flex flex-col gap-1 md:gap-2 relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Autonomous Multi-Agent AI Assessment Matrix
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-md max-w-3xl leading-relaxed">
            Deploy cognitive neural pipelines to parse raw academic syllabi. Spawns 5 distinct LLM agents to map curriculums, engineer robust evaluation items, and calculate psychometric analytics.
          </p>
        </div>

        {/* Form Controls Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-xl relative backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" /> Payload Data Input (Syllabus / Lecture Notes)
            </label>
            <textarea 
              rows={5}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="p-3 md:p-4 border border-slate-800 rounded-xl bg-slate-950/80 text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none text-xs md:text-sm font-mono leading-relaxed"
              placeholder="Inject structured context or raw strings here (e.g., Topic 1: Memory Architectures, Cache Maps, TLB misses...)"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end mt-4 md:mt-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] md:text-xs font-black tracking-widest text-slate-400 uppercase">Registry Session Identifier</label>
              <input 
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="p-2.5 md:p-3 border border-slate-800 rounded-xl bg-slate-950/80 text-slate-300 focus:outline-none focus:border-cyan-500/50 text-xs md:text-sm font-mono"
                placeholder="e.g., COREC_ENG_MIDS_2026"
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="relative group bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 overflow-hidden text-xs md:text-sm"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <span className="flex items-center gap-2 text-cyan-200">
                  <Cpu className="w-3.5 h-3.5 animate-spin" /> Processing Pipeline...
                </span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 group-hover:animate-spin" /> 
                  <span>Compile Exam Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* LIVE DATA INTERFACE DISPLAY */}
        {/* ===================================================================== */}
        {examData && (
          <div className="flex flex-col gap-4 md:gap-6 animate-fadeIn mt-2">
            
            {/* Dynamic Tech Tab System (Horizontally scrollable rows on mobile screens) */}
            <div className="flex border border-slate-800 bg-slate-900/30 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-none snap-x">
              <button 
                onClick={() => setActiveTab('curriculum')}
                className={`flex-shrink-0 snap-center flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'curriculum' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Mapping
              </button>
              <button 
                onClick={() => setActiveTab('questions')}
                className={`flex-shrink-0 snap-center flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'questions' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Item Writer
              </button>
              <button 
                onClick={() => setActiveTab('difficulty')}
                className={`flex-shrink-0 snap-center flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'difficulty' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Psychometrics
              </button>
              <button 
                onClick={() => setActiveTab('rubric')}
                className={`flex-shrink-0 snap-center flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'rubric' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Rubric Guide
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex-shrink-0 snap-center flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'analytics' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <BarChart className="w-3.5 h-3.5" /> Analytics
              </button>
            </div>

            {/* Core Output Shell */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-4 md:p-6 min-h-[350px]">
              
              {/* Tab 1: Curriculum Analysis */}
              {activeTab === 'curriculum' && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="font-bold text-base md:text-lg text-slate-200">Domain Area Decomposition</h3>
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] md:text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-black w-fit">
                      Subject: {examData.curriculum?.subject || "Not Specified"}
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {examData.curriculum?.topics?.map((t: any, idx: number) => (
                      <div key={idx} className="border border-slate-800/60 p-4 rounded-xl bg-slate-950/40 hover:border-slate-700 transition-all">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 mb-3">
                          <h4 className="font-bold text-indigo-400 text-xs md:text-sm">📍 Segment {idx + 1}: {t.topic}</h4>
                          <span className={`text-[9px] md:text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border font-black w-fit ${t.importance === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            Priority: {t.importance}
                          </span>
                        </div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Objectives</p>
                        <ul className="list-none space-y-1.5 text-xs md:text-sm text-slate-400">
                          {t.objectives?.map((obj: string, oIdx: number) => (
                            <li key={oIdx} className="flex items-start gap-2">
                              <span className="text-cyan-500 mt-1 flex-shrink-0">▪</span> <span className="break-words">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Questions Writer */}
              {activeTab === 'questions' && (
                <div className="flex flex-col gap-5">
                  <h3 className="font-bold text-base md:text-lg text-slate-200 border-b border-slate-800 pb-4">Compiled Structural Items</h3>
                  <div className="space-y-4">
                    {examData.questions?.questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-slate-800 p-4 md:p-5 rounded-xl bg-slate-950/30 flex flex-col gap-3">
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-2">
                          <span className="font-semibold text-slate-200 text-sm md:text-md">{idx + 1}. {q.question_text}</span>
                          <span className="bg-slate-800 border border-slate-700 text-slate-400 text-[9px] tracking-wider uppercase px-2 py-0.5 rounded font-bold whitespace-nowrap w-fit">{q.question_type}</span>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="border border-slate-800 bg-slate-950/50 p-2.5 md:p-3 rounded-lg text-xs text-slate-400 hover:border-indigo-500/40 hover:text-slate-200 transition-all break-words">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-emerald-400 font-bold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg w-full sm:w-fit break-words">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-500 font-normal uppercase tracking-wider text-[9px]">Response Key:</span>
                          </div>
                          <span>{q.correct_answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Difficulty Evaluator */}
              {activeTab === 'difficulty' && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h3 className="font-bold text-base md:text-lg text-slate-200">Psychometric Distribution Metrics</h3>
                    <div className="flex flex-wrap gap-1.5 text-[9px] md:text-[10px] font-black tracking-wider uppercase">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">Easy: {examData.difficulty?.difficulty_distribution?.Easy || 0}</span>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded">Med: {examData.difficulty?.difficulty_distribution?.Medium || 0}</span>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded">Hard: {examData.difficulty?.difficulty_distribution?.Hard || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {examData.difficulty?.calibrated_questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-500">REF_ID: #{q.question_id || idx+1}</span>
                          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                            q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>{q.difficulty}</span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-300 italic">"{q.question_text}"</p>
                        <div className="text-xs text-slate-400 mt-1 bg-slate-950 border border-slate-800 p-3 rounded-lg leading-relaxed break-words">
                          <strong className="text-indigo-400 text-[9px] tracking-wider uppercase block mb-0.5">Valuation Reason:</strong> {q.difficulty_reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Rubric Expert */}
              {activeTab === 'rubric' && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="font-bold text-base md:text-lg text-slate-200">Scoring Matrix Architecture</h3>
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] md:text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full w-fit">
                      Aggregate Metrics: {examData.rubric?.total_marks || 50} Points
                    </span>
                  </div>
                  <div className="space-y-3">
                    {examData.rubric?.rubric?.map((r: any, idx: number) => (
                      <div key={idx} className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5 mb-1">
                          <span className="font-bold text-purple-400 text-[10px] md:text-xs tracking-wider uppercase">Criteria #{idx + 1}</span>
                          <span className="bg-purple-500/5 text-purple-300 text-[9px] border border-purple-500/10 px-2 py-0.5 rounded font-black">{r.marks} WT PT(S)</span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-300">"{r.question_text}"</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 break-words">
                            <strong className="text-emerald-400 text-[9px] tracking-wider uppercase block mb-1">Target Key Solution:</strong>
                            <span className="text-slate-400">{r.correct_answer}</span>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 break-words">
                            <strong className="text-purple-400 text-[9px] tracking-wider uppercase block mb-1">Scoring Mechanics Rubric:</strong>
                            <span className="text-slate-400">{r.marking_guide}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Analytics Agent */}
              {activeTab === 'analytics' && (
                <div className="flex flex-col gap-5 md:flex-col md:gap-6">
                  <h3 className="font-bold text-base md:text-lg text-slate-200 border-b border-slate-800 pb-4">Neural Pipeline Analytics</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col justify-center items-center text-center">
                      <span className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-black">Total Matrix Items</span>
                      <span className="text-2xl md:text-3xl font-black text-cyan-400 mt-1">{examData.analytics?.total_questions || 0}</span>
                    </div>
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col justify-center items-center text-center">
                      <span className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-black">Aggregate Weight Score</span>
                      <span className="text-2xl md:text-3xl font-black text-purple-400 mt-1">{examData.analytics?.total_marks || 0}</span>
                    </div>
                  </div>

                  {/* Coverage bars */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Syllabus Domain Distribution Map</h4>
                    <div className="space-y-2.5">
                      {examData.analytics?.topic_coverage?.map((tc: any, idx: number) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex flex-col gap-2">
                          <div className="flex justify-between items-start text-xs font-semibold gap-2">
                            <span className="text-slate-300 break-words flex-1">{tc.topic}</span>
                            <span className="text-cyan-400 font-mono text-[11px] whitespace-nowrap">{tc.coverage_percentage}% ({tc.questions_count} items)</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${tc.coverage_percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps */}
                  {examData.analytics?.gaps && examData.analytics.gaps.length > 0 && (
                    <div className="bg-amber-500/5 border border-amber-500/10 p-3 md:p-4 rounded-xl text-amber-400/90 flex flex-col gap-2">
                      <h4 className="font-bold text-[10px] md:text-xs flex items-center gap-2 uppercase tracking-widest">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" /> Detected Analytical Knowledge Gaps
                      </h4>
                      <ul className="list-none space-y-1.5 text-xs text-slate-400 font-mono pl-1">
                        {examData.analytics.gaps.map((gap: string, gIdx: number) => (
                          <li key={gIdx} className="flex items-start gap-2 break-words">
                            <span className="text-amber-500 flex-shrink-0">⚠</span> <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 md:p-4 rounded-xl text-slate-300">
                    <h4 className="font-bold text-[10px] md:text-xs text-indigo-400 flex items-center gap-2 uppercase tracking-widest mb-2">
                      <Layers className="w-4 h-4 text-indigo-400 flex-shrink-0" /> Blueprint Architecture Synthesis
                    </h4>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-slate-400 break-words">{examData.analytics?.summary}</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}