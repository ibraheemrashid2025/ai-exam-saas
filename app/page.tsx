"use client";
import { useState } from "react";
import { BookOpen, Send, History, Trash2, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState<any>(null);

  const generateExam = async () => {
    if (!topic) return alert("Please paste your syllabus or topic first!");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty: "Medium", numQuestions: 5 }),
      });
      const data = await res.json();
      setExamData(data);
    } catch (err) {
      alert("Failed to generate. Please check your API key.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar - Just like your Streamlit UI */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">ExamAI Pro</span>
        </div>

        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <History className="w-4 h-4" /> Past Sessions
        </h3>
        
        <div className="space-y-2">
          {["AI Midterm", "OS Quiz", "Embedded Systems"].map((session) => (
            <div key={session} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-md cursor-pointer border border-transparent hover:border-slate-100 transition-all">
              <span className="text-sm text-slate-600 truncate">{session}</span>
              <Trash2 className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
              📝 Autonomous Educational Assessment Creator
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Paste your syllabus or lecture notes below and generate a complete exam paper automatically.
            </p>
          </header>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              📋 Paste your curriculum notes or syllabus here:
            </label>
            <textarea 
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400"
              placeholder="e.g. Chapter 1: Introduction to Operating Systems..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="mt-6 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Name (to save this exam):</label>
                <input 
                  type="text" 
                  placeholder="e.g. OS Midterm Exam" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <button 
                onClick={generateExam} 
                disabled={loading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:bg-slate-400"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? "Generating..." : "Generate Exam Paper"}
              </button>
            </div>
          </section>

          {/* Results Area */}
          {examData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Send className="w-6 h-6 text-blue-600" /> Generated Questions
              </h2>
              {examData.questions?.map((q: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-lg font-semibold text-slate-800 leading-relaxed">
                    <span className="text-blue-600 mr-2">{i + 1}.</span> {q.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt: string, j: number) => (
                      <div key={j} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                        <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + j)}</span> {opt}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      ✓ Correct Answer: {q.correct_answer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}