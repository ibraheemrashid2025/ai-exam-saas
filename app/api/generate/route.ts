import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Groq client ko initialize kar rahe hain process environment key se
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Har agent ke liye common helper function jo api call ko handle karega
async function callAgent(systemPrompt: string, userPrompt: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 1500,
      // Groq ko force karega ke sirf valid JSON object hi return kare
      response_format: { type: "json_object" }, 
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Agent call or JSON parse failed:", error);
    return { error: "Failed to generate valid response from agent" };
  }
}

export async function POST(req: Request) {
  try {
    // Frontend se 'topic' aur 'sessionName' extract kar rahe hain
    const { topic, sessionName } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Syllabus or Topic is required" }, { status: 400 });
    }

    // Agent 1: Curriculum - Syllabus ko analyze karke unwanat nikalta hai
    const curriculum = await callAgent(
      `You are a Curriculum Analysis Expert. Extract topics and learning objectives from notes.
       Respond with valid JSON only:
       {"subject": "name", "topics": [{"topic": "name", "objectives": ["obj1"], "importance": "High"}]}`,
      `Extract topics from: ${topic}`
    );

    // Agent 2: Questions - Unwanat ke hisab se sawalat banata hai
    const questions = await callAgent(
      `You are an Exam Question Writer. Generate MCQ, TrueFalse, ShortQuestion questions.
       Respond with valid JSON only:
       {"questions": [{"question_id": "Q1", "question_type": "MCQ", "topic": "name", "question_text": "text", "options": ["A. opt1", "B. opt2", "C. opt3", "D. opt4"], "correct_answer": "A. opt1"}]}`,
      `Generate questions for: ${JSON.stringify(curriculum)}`
    );

    // Agent 3: Difficulty - Sawalat ke mushkil hone ka miyar check karta hai
    const difficulty = await callAgent(
      `You are a Difficulty Calibration Expert. Assign Easy/Medium/Hard to each question.
       Respond with valid JSON only:
       {"calibrated_questions": [{"question_id": "Q1", "question_text": "text", "question_type": "MCQ", "topic": "name", "options": [], "correct_answer": "ans", "difficulty": "Easy", "difficulty_reason": "reason"}], "difficulty_distribution": {"Easy": 5, "Medium": 10, "Hard": 5}}`,
      `Calibrate: ${JSON.stringify(questions)}`
    );

    // Agent 4: Rubric - Jawabat ka tarika aur marks allot karta hai
    const rubric = await callAgent(
      `You are a Rubric Designer. Create marking scheme.
       Respond with valid JSON only:
       {"total_marks": 50, "rubric": [{"question_id": "Q1", "question_text": "text", "correct_answer": "ans", "marks": 1, "marking_guide": "guide"}]}`,
      `Create rubric for: ${JSON.stringify(difficulty)}`
    );

    // Agent 5: Analytics - Poore paper ki coverage aur kamiyun ka report banta hai
    const analytics = await callAgent(
      `You are an Analytics Expert. Generate coverage report.
       Respond with valid JSON only:
       {"total_questions": 20, "total_marks": 50, "topic_coverage": [{"topic": "name", "questions_count": 3, "marks_allocated": 5, "coverage_percentage": 15.0}], "gaps": ["gap1"], "summary": "summary"}`,
      `Analyze: ${JSON.stringify({ curriculum, difficulty, rubric })}`
    );

    // Sab agents ka data successfully return kiya ja raha hai
    return NextResponse.json({ 
      status: 'success',
      curriculum, 
      questions, 
      difficulty, 
      rubric, 
      analytics, 
      sessionName 
    });

  } catch (error) {
    console.error("Pipeline failed:", error);
    return NextResponse.json({ status: 'error', message: "Pipeline failed" }, { status: 500 });
  }
}