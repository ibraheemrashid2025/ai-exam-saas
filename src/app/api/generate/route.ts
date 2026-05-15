import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. User se input lena (Topic, Difficulty, etc.)
    const { topic, difficulty, numQuestions } = await req.json();

    // 2. Groq API ko call karna
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert academic examiner. Output strictly in JSON format."
          },
          {
            role: "user",
            content: `Generate a ${difficulty} level exam on the topic "${topic}" with ${numQuestions} questions. 
            Return a JSON object with a 'questions' array. 
            Each question should have: 'question', 'options' (array of 4), and 'correct_answer'.`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    // 3. AI ka result user ko wapis bhejna
    const aiContent = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(aiContent);

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate exam" }, { status: 500 });
  }
}