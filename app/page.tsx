"use client";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState<any>(null);

  const generateExam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ topic, difficulty: "Medium", numQuestions: 5 }),
      });
      const data = await res.json();
      setExamData(data);
    } catch (err) {
      alert("Error generating exam");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">AI Exam Generator</h1>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter topic (e.g. Embedded Systems)..."
            className="flex-1 p-3 border rounded-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            onClick={generateExam}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate Exam"}
          </button>
        </div>

        {examData && (
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold">Generated Questions:</h2>
            {examData.questions?.map((q: any, i: number) => (
              <div key={i} className="border-b pb-4 last:border-0">
                <p className="font-medium">{i + 1}. {q.question}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {q.options.map((opt: string, j: number) => (
                    <div key={j} className="p-2 bg-gray-100 rounded text-sm">{opt}</div>
                  ))}
                </div>
                <p className="mt-2 text-green-600 text-sm font-bold">Ans: {q.correct_answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}