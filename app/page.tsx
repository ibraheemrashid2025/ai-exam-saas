"use client";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState<any>(null);

  const generateExam = async () => {
    if (!topic) return alert("Please enter a topic");
    
    setLoading(true);
    setExamData(null); // Purana data clear karein

    try {
      console.log("Sending request to /api/generate...");
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          topic, 
          difficulty: "Medium", 
          numQuestions: 5 
        }),
      });

      console.log("Response status:", res.status);
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setExamData(data);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">AI Exam Generator</h1>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter topic (e.g. Embedded Systems)..."
            className="flex-1 p-3 border rounded-lg focus:outline-blue-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            onClick={generateExam}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Generating..." : "Generate Exam"}
          </button>
        </div>

        {examData && (
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md animate-in fade-in duration-500">
            <h2 className="text-2xl font-semibold border-b pb-2">Generated Questions:</h2>
            {examData.questions?.map((q: any, i: number) => (
              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-lg">{i + 1}. {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt: string, j: number) => (
                    <div key={j} className="p-3 bg-gray-50 border rounded-md text-sm hover:bg-blue-50 transition">
                      <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span> {opt}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Correct Answer: {q.correct_answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}