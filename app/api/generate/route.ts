import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, difficulty, numQuestions } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert examiner. Output strictly in JSON format." },
          { role: "user", content: `Generate a ${difficulty} level exam on ${topic} with ${numQuestions} questions. Return JSON with 'questions' array. Each has 'question', 'options' (4), and 'correct_answer'.` }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(aiContent);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}