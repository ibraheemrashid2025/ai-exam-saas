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
  Layers 
} from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum'); 
  const [examData, setExamData] = useState<any>(null);

  // Triggered when user clicks the generate button
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
        setActiveTab('curriculum'); // Switch to first tab on success
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
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar - Saved History Sessions */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Sparkles className="w-6 h-6 animate-pulse" /> ExamAI Pro
        </div>
        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Past Sessions</div>
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <div className="p-2 hover:bg-slate-100 rounded cursor-pointer transition-all">AI Midterm</div>
          <div className="p-2 hover:bg-slate-100 rounded cursor-pointer transition-all">OS Quiz</div>
          <div className="p-2 hover:bg-slate-100 rounded cursor-pointer transition-all">Embedded Systems</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            📝 Autonomous AI Examination Blueprint & Assessment Panel
          </h1>
          <p className="text-slate-500 text-lg">Paste your course syllabus or lecture notes below to generate a comprehensive exam paper via 5 multi-agent LLM processors.</p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700 flex items-center gap-2">
              📋 Input Syllabus or Lecture Reference Notes:
            </label>
            <textarea 
              rows={6}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="p-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm font-mono"
              placeholder="E.g., 1. Data Management: Versioning, Validation, Feature Stores..."
            />
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1 flex flex-col gap-2">
              <label className="font-semibold text-slate-700">Session Designation Name (For Registry Archive):</label>
              <input 
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g., Midterms, Final Quiz, Core Assessment"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:bg-slate-400"
            >
              {loading ? "Agents processing pipeline... 🧠" : <><Sparkles className="w-5 h-5"/> Generate Exam Matrix</>}
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 5 AGENTS TABS SECTION - LIVE ASSESSMENT DATA DISPATCH */}
        {/* ===================================================================== */}
        {examData && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Navigating Tabs bar */}
            <div className="flex border-b border-slate-200 bg-white p-1.5 rounded-xl border gap-1 shadow-sm">
              <button 
                onClick={() => setActiveTab('curriculum')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'curriculum' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <BookOpen className="w-4 h-4" /> 1. Curriculum Specialist
              </button>
              <button 
                onClick={() => setActiveTab('questions')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'questions' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <HelpCircle className="w-4 h-4" /> 2. Question Writer
              </button>
              <button 
                onClick={() => setActiveTab('difficulty')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'difficulty' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <ShieldAlert className="w-4 h-4" /> 3. Difficulty Evaluator
              </button>
              <button 
                onClick={() => setActiveTab('rubric')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'rubric' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <FileText className="w-4 h-4" /> 4. Rubric Expert
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <BarChart className="w-4 h-4" /> 5. Analytics Agent
              </button>
            </div>

            {/* Content box of selected agent */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[300px]">
              
              {/* Tab 1: Curriculum Analysis */}
              {activeTab === 'curriculum' && (
                <div className="flex flex-col gap-4">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-slate-800">Syllabus Mapping Analysis</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">
                      Subject: {examData.curriculum?.subject || "Not Specified"}
                    </span>
                  </div>
                  <div className="grid gap-4 mt-2">
                    {examData.curriculum?.topics?.map((t: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 p-4 rounded-xl bg-slate-50 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-blue-600 text-md">📌 Topic {idx + 1}: {t.topic}</h4>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${t.importance === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                            Weight Priority: {t.importance}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Learning Objectives:</p>
                        <ul className="list-disc pl-5 text-sm text-slate-600 flex flex-col gap-1">
                          {t.objectives?.map((obj: string, oIdx: number) => (
                            <li key={oIdx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Questions Writer */}
              {activeTab === 'questions' && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-3">Drafted Examination Items</h3>
                  <div className="flex flex-col gap-6">
                    {examData.questions?.questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 p-5 rounded-xl bg-slate-50 flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-slate-700 text-base">{idx + 1}. {q.question_text}</span>
                          <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded font-bold whitespace-nowrap">{q.question_type}</span>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt: string, oIdx: number) => (
                              <div key={oIdx} className="border border-slate-200 bg-white p-3 rounded-lg text-sm hover:border-blue-500 transition-all cursor-pointer">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 p-2 rounded-lg w-fit">
                          <CheckCircle2 className="w-4 h-4" /> Validated Core Key: {q.correct_answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Difficulty Evaluator */}
              {activeTab === 'difficulty' && (
                <div className="flex flex-col gap-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-slate-800">Difficulty Calibration Metrics</h3>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold">Easy: {examData.difficulty?.difficulty_distribution?.Easy || 0}</span>
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded font-bold">Medium: {examData.difficulty?.difficulty_distribution?.Medium || 0}</span>
                      <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded font-bold">Hard: {examData.difficulty?.difficulty_distribution?.Hard || 0}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {examData.difficulty?.calibrated_questions?.map((q: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700 text-sm">Item ID Reference: {q.question_id}</span>
                          <span className={`text-xs px-2 py-1 rounded font-black ${
                            q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>{q.difficulty}</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">"{q.question_text}"</p>
                        <div className="text-xs text-slate-500 mt-1 bg-white p-2.5 rounded border border-slate-100">
                          <strong>Psychometric Valuation Reasoning:</strong> {q.difficulty_reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Rubric Expert */}
              {activeTab === 'rubric' && (
                <div className="flex flex-col gap-6">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-slate-800">Evaluative Marking Rubric Scheme</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1.5 rounded-full font-bold">
                      Aggregate Cumulative Value (Total Marks): {examData.rubric?.total_marks || 50}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {examData.rubric?.rubric?.map((r: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-indigo-600 text-sm">Standard Matrix Guide - Question {idx + 1}</span>
                          <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded font-bold">{r.marks} Unit Weight Mark(s)</span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">"{r.question_text}"</p>
                        <div className="grid grid-cols-2 gap-3 mt-1 text-xs text-slate-500">
                          <div className="bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                            <strong className="text-emerald-800">Target Solution Key:</strong> {r.correct_answer}
                          </div>
                          <div className="bg-indigo-50/30 p-2.5 rounded border border-indigo-100">
                            <strong className="text-indigo-800">Scoring Assessment Matrix Criteria:</strong> {r.marking_guide}
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
                  <h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-3">Final Assessment Analytics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex flex-col justify-center items-center text-center">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Assessment Items Generated</span>
                      <span className="text-4xl font-black text-blue-600 mt-1">{examData.analytics?.total_questions || 0}</span>
                    </div>
                    <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex flex-col justify-center items-center text-center">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Allocated Weight Criteria Points</span>
                      <span className="text-4xl font-black text-indigo-600 mt-1">{examData.analytics?.total_marks || 0}</span>
                    </div>
                  </div>

                  {/* Syllabus Topic Coverage Bars */}
                  <div className="mt-2 flex flex-col gap-3">
                    <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Syllabus Domain Area Coverage Distribution</h4>
                    <div className="flex flex-col gap-3">
                      {examData.analytics?.topic_coverage?.map((tc: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700">{tc.topic}</span>
                            <span className="text-indigo-600">{tc.coverage_percentage}% ({tc.questions_count} Assessment Items)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${tc.coverage_percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Identified Gaps / Red flags */}
                  {examData.analytics?.gaps && examData.analytics.gaps.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 flex flex-col gap-2">
                      <h4 className="font-bold text-sm flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Detected Knowledge Gaps & Omissions
                      </h4>
                      <ul className="list-disc pl-5 text-xs flex flex-col gap-1 text-amber-700 font-medium">
                        {examData.analytics.gaps.map((gap: string, gIdx: number) => (
                          <li key={gIdx}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Executive Summary */}
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-slate-700">
                    <h4 className="font-bold text-sm text-blue-800 flex items-center gap-1.5 mb-1.5">
                      <Layers className="w-4 h-4" /> Blueprint Architecture Executive Summary
                    </h4>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium">{examData.analytics?.summary}</p>
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