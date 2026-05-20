import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, sessionName } = await req.json();

    if (!topic) {
      return NextResponse.json({ status: 'error', message: "Syllabus or Topic is required" });
    }

    const systemPrompt = `
      You are an automated 5-agent university assessment builder system. 
      Analyze the provided syllabus/text and generate a comprehensive exam plan.
      You MUST respond with a single, valid JSON object that strictly matches the expected frontend structure below. No markdown formatting like \`\`\`json, just raw JSON.

      JSON Structure Expected:
      {
        "curriculum": {
          "subject": "Name of the course/subject",
          "topics": [
            { "topic": "Topic Name", "importance": "High", "objectives": ["Objective 1", "Objective 2"] }
          ]
        },
        "questions": {
          "questions": [
            { "question_text": "Write a complete question here?", "question_type": "MCQ", "options": ["Option A", "Option B", "Option C", "Option D"], "correct_answer": "Option A" }
          ]
        },
        "difficulty": {
          "difficulty_distribution": { "Easy": 2, "Medium": 3, "Hard": 1 },
          "calibrated_questions": [
            { "question_id": "1", "difficulty": "Medium", "question_text": "Same question text here", "difficulty_reason": "Why this question is medium difficulty" }
          ]
        },
        "rubric": {
          "total_marks": 30,
          "rubric": [
            { "question_text": "Same question text here", "marks": 5, "correct_answer": "Option A", "marking_guide": "Criteria for awarding full marks" }
          ]
        },
        "analytics": {
          "total_questions": 5,
          "total_marks": 30,
          "topic_coverage": [
            { "topic": "Topic Name", "coverage_percentage": 90, "questions_count": 4 }
          ],
          "gaps": ["Any missing subtopics or concepts in the input notes"],
          "summary": "Detailed executive summary blueprint of the examination paper."
        }
      }
    `;

    // Updated the model to the latest active llama-3.1-8b-instant model
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Session: ${sessionName || 'Exam'}\nSyllabus notes to analyze:\n${topic}` }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }, 
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(content);

    return NextResponse.json({
      status: 'success',
      curriculum: parsedData.curriculum || { subject: "Not Specified", topics: [] },
      questions: parsedData.questions || { questions: [] },
      difficulty: parsedData.difficulty || { difficulty_distribution: {}, calibrated_questions: [] },
      rubric: parsedData.rubric || { total_marks: 0, rubric: [] },
      analytics: parsedData.analytics || { total_questions: 0, total_marks: 0, topic_coverage: [], gaps: [], summary: "" },
      sessionName
    });

  } catch (error: any) {
    console.error("Mega pipeline execution failed:", error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || "An unknown backend error occurred." 
    });
  }
}