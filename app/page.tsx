'use client';

import { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum'); 
  const [examData, setExamData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic) return alert("Please paste the syllabus content first!");
    setLoading(true);
    setExamData(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, sessionName }),
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        setExamData(data);
        setActiveTab('curriculum'); 
      } else {
        alert("Agents encountered an error: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Could not establish a connection with the backend server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Sidebar - Premium AI SaaS Navigation */}
      <div className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col gap-8">
        
        {/* Tech Branding Logo Area */}
        <div className="flex items-center gap-3 group cursor-pointer">
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
            <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase -mt-1">Core Engine v1.1</span>
          </div>
        </div>

        <div className="h-[1px] bg-gradient-to-r from-slate-800 to-transparent" />

        {/* Saved Archival History */}
        <div className="flex flex-col gap-4">
          <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-2">
            <History className="w-3 h-3 text-indigo-400" /> Archival Registries
          </div>
          <div className="flex flex-col gap-1 text-sm text-slate-400">
            <div className="flex items-center gap-2 p-2.5 hover:bg-slate-800/60 hover:text-cyan-400 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-800">
              <Terminal className="w-4 h-4 text-slate-600" /> AI Midterm Assessment
            </div>
            <div className="flex items-center gap-2 p-2.5 hover:bg-slate-800/60 hover:text-cyan-400 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-800">
              <Terminal className="w-4 h-4 text-slate-600" /> Operating Systems Quiz
            </div>
            <div className="flex items-center gap-2 p-2.5 hover:bg-slate-800/60 hover:text-cyan-400 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-800">
              <Terminal className="w-4 h-4 text-slate-600" /> Embedded Systems Blueprint
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="flex-1 p-10 max-w-5xl mx-auto flex flex-col gap-8 overflow-y-auto">
        
        {/* Header Segment */}
        <div className="flex flex-col gap-2 relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-5 right-20 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Autonomous Multi-Agent AI Assessment Matrix
          </h1>
          <p className="text-slate-400 text-md max-w-3xl leading-relaxed">
            Deploy cognitive neural pipelines to parse raw academic syllabi. Spawns 5 distinct LLM agents to map curriculums, engineer robust evaluation items, and calculate psychometric analytics.
          </p>
        </div>

        {/* Form Controls Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" /> Payload Data Input (Syllabus / Lecture Notes)
            </label>
            <textarea 
              rows={6}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="p-4 border border-slate-800 rounded-xl bg-slate-950/80 text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none text-sm font-mono leading-relaxed"
              placeholder="Inject structured context or raw strings here (e.g., Topic 1: Memory Architectures, Cache Maps, TLB misses...)"
            />
          </div>

          <div className="flex gap-4 items-end mt-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-black tracking-widest text-slate-400 uppercase">Registry Session Identifier</label>
              <input 
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="p-3 border border-slate-800 rounded-xl bg-slate-950/80 text-slate-300 focus:outline-none focus:border-cyan-500/50 text-sm font-mono"
                placeholder="e.g., COREC_ENG_MIDS_2026"
              />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="relative group bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/10 flex items-center gap-2 transition-all active:scale-[0.98] disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <span className="flex items-center gap-2 text-cyan-200">
                  <Cpu className="w-4 h-4 animate-spin" /> Processing Pipeline Hub...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300 group-hover:animate-spin" /> 
                  <span>Compile Exam Matrix</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* LIVE DATA INTERFACE DISPLAY */}
        {/* ===================================================================== */}
        {examData && (
          <div className="flex flex-col gap-6 animate-fadeIn mt-2">
            
            {/* Dynamic Tech Tab System */}
            <div className="flex border border-slate-800 bg-slate-900/30 p-1.5 rounded-xl gap-1">
              <button 
                onClick={() => setActiveTab('curriculum')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'curriculum' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Mapping
              </button>
              <button 
                onClick={() => setActiveTab('questions')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'questions' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Item Writer
              </button>
              <button 
                onClick={() => setActiveTab('difficulty')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'difficulty' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Psychometrics
              </button>
              <button 
                onClick={() => setActiveTab('rubric')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'rubric' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Rubric Guide
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase rounded-lg transition-all border ${activeTab === 'analytics' ? 'bg-indigo-600/10 text-cyan-400 border-indigo-500/30 shadow-md shadow-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
              >
                <BarChart className="w-3.5 h-3.5" /> Analytics
              </button>
            </div>

            {/* Core Output Shell */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 min-h-[350px]">
              
              {/* Tab 1: Curriculum Analysis */}
              {activeTab === 'curriculum' && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-200">Domain Area Decomposition</h3>
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-black">
                      Subject: {examData.curriculum?.subject || "Not Specified"}
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {examData.curriculum?.topics?.map((t: any, idx: number) => (
                      <div key={idx} className="border border-slate-800/60 p-4 rounded-xl bg-slate-950/40 hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-indigo-400 text-sm">📍 Segment {idx + 1}: {t.topic}</h4>
                          <span className={`text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded border font-black ${t.importance === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            Priority: {t.importance}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Objectives</p>
                        <ul className="list-none space-y-1.5 text-sm text-slate-400">
                          {t.objectives?.map((obj: string, oIdx: number) => (
                            <li key={oIdx} className="flex items-start gap-2">
                              <span className="text-cyan-500 mt-1">▪</span> <span>{obj}</span>
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
                  <h3 className="font-bold text-lg text-slate-200 border-b border-slate-800 pb-4">Compiled Structural Items</h3>
                  <div className="space-y-4">
                    {examData.questions?.questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-slate-800 p-5 rounded-xl bg-slate-950/30 flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="font-semibold text-slate-200 text-md">{idx + 1}. {q.question_text}</span>
                          <span className="bg-slate-800 border border-slate-700 text-slate-400 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-bold whitespace-nowrap">{q.question_type}</span>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="border border-slate-800 bg-slate-950/50 p-3 rounded-lg text-xs text-slate-400 hover:border-indigo-500/40 hover:text-slate-200 transition-all">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-emerald-400 font-bold flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg w-fit">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span className="text-slate-500 font-normal uppercase tracking-wider text-[10px]">Validated Response Key:</span> {q.correct_answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Difficulty Evaluator */}
              {activeTab === 'difficulty' && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-200">Psychometric Distribution Metrics</h3>
                    <div className="flex gap-1.5 text-[10px] font-black tracking-wider uppercase">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">Easy: {examData.difficulty?.difficulty_distribution?.Easy || 0}</span>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded">Med: {examData.difficulty?.difficulty_distribution?.Medium || 0}</span>
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded">Hard: {examData.difficulty?.difficulty_distribution?.Hard || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {examData.difficulty?.calibrated_questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-slate-500">REF_ID: #{q.question_id || idx+1}</span>
                          <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                            q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>{q.difficulty}</span>
                        </div>
                        <p className="text-sm text-slate-300 italic">"{q.question_text}"</p>
                        <div className="text-xs text-slate-400 mt-1 bg-slate-950 border border-slate-800 p-3 rounded-lg leading-relaxed">
                          <strong className="text-indigo-400 text-[10px] tracking-wider uppercase block mb-0.5">Valuation Reason:</strong> {q.difficulty_reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Rubric Expert */}
              {activeTab === 'rubric' && (
                <div className="flex flex-col gap-5">
                  <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-200">Scoring Matrix Architecture</h3>
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                      Aggregate Metrics: {examData.rubric?.total_marks || 50} Points
                    </span>
                  </div>
                  <div className="space-y-3">
                    {examData.rubric?.rubric?.map((r: any, idx: number) => (
                      <div key={idx} className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b border-slate-800/40 pb-1.5 mb-1">
                          <span className="font-bold text-purple-400 text-xs tracking-wider uppercase">Item Assessment Criteria #{idx + 1}</span>
                          <span className="bg-purple-500/5 text-purple-300 text-[10px] border border-purple-500/10 px-2 py-0.5 rounded font-black">{r.marks} WT PT(S)</span>
                        </div>
                        <p className="text-sm text-slate-300">"{r.question_text}"</p>
                        <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                            <strong className="text-emerald-400 text-[10px] tracking-wider uppercase block mb-1">Target Key Solution:</strong>
                            <span className="text-slate-400">{r.correct_answer}</span>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                            <strong className="text-purple-400 text-[10px] tracking-wider uppercase block mb-1">Scoring Mechanics Rubric:</strong>
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
                <div className="flex flex-col gap-6">
                  <h3 className="font-bold text-lg text-slate-200 border-b border-slate-800 pb-4">Neural Pipeline Analytics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Total Matrix Items</span>
                      <span className="text-3xl font-black text-cyan-400 mt-1">{examData.analytics?.total_questions || 0}</span>
                    </div>
                    <div className="border border-slate-800 p-4 rounded-xl bg-slate-950/40 flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Aggregate Weight Score</span>
                      <span className="text-3xl font-black text-purple-400 mt-1">{examData.analytics?.total_marks || 0}</span>
                    </div>
                  </div>

                  {/* Coverage bars */}
                  <div className="flex flex-col gap-3">
                    <h4 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Syllabus Domain Area Distribution Map</h4>
                    <div className="space-y-2.5">
                      {examData.analytics?.topic_coverage?.map((tc: any, idx: number) => (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex flex-col gap-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">{tc.topic}</span>
                            <span className="text-cyan-400 font-mono">{tc.coverage_percentage}% ({tc.questions_count} items)</span>
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
                    <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-amber-400/90 flex flex-col gap-2">
                      <h4 className="font-bold text-xs flex items-center gap-2 uppercase tracking-widest">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Detected Analytical Knowledge Gaps
                      </h4>
                      <ul className="list-none space-y-1 text-xs text-slate-400 font-mono">
                        {examData.analytics.gaps.map((gap: string, gIdx: number) => (
                          <li key={gIdx} className="flex items-center gap-2">
                            <span className="text-amber-500">⚠</span> {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-slate-300">
                    <h4 className="font-bold text-xs text-indigo-400 flex items-center gap-2 uppercase tracking-widest mb-2">
                      <Layers className="w-4 h-4 text-indigo-400" /> Blueprint Architecture Synthesis
                    </h4>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-slate-400">{examData.analytics?.summary}</p>
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