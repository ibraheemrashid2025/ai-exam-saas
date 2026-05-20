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
      Analyze the provided syllabus/text and generate a highly detailed, comprehensive exam plan.
      
      CRITICAL REQUIREMENT: You MUST generate AT LEAST 10 distinct, diverse, and comprehensive examination questions (include a healthy mix of MCQs, Short Questions, and True/False based on the syllabus depth). 
      For EVERY question generated, you must also provide its corresponding entry in the 'difficulty' calibration and 'rubric' schema. Do not truncate the output.

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
            { "question_text": "Question 1 text here?", "question_type": "MCQ", "options": ["Option A", "Option B", "Option C", "Option D"], "correct_answer": "Option A" },
            { "question_text": "Question 2 text here?", "question_type": "Short Question", "options": [], "correct_answer": "Expected key bullet points for answer" }
            // Generate at least 10 questions here...
          ]
        },
        "difficulty": {
          "difficulty_distribution": { "Easy": 3, "Medium": 5, "Hard": 2 },
          "calibrated_questions": [
            { "question_id": "1", "difficulty": "Medium", "question_text": "Question 1 text here", "difficulty_reason": "Why this question is medium" }
            // Must calibrate all 10+ questions here...
          ]
        },
        "rubric": {
          "total_marks": 50,
          "rubric": [
            { "question_text": "Question 1 text here", "marks": 5, "correct_answer": "Option A", "marking_guide": "Criteria for awarding full marks" }
            // Must provide rubric for all 10+ questions here...
          ]
        },
        "analytics": {
          "total_questions": 10,
          "total_marks": 50,
          "topic_coverage": [
            { "topic": "Topic Name", "coverage_percentage": 90, "questions_count": 4 }
          ],
          "gaps": ["Any missing subtopics or concepts in the input notes"],
          "summary": "Detailed executive summary blueprint of the examination paper."
        }
      }
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Session: ${sessionName || 'Exam'}\nSyllabus notes to analyze:\n${topic}` }
      ],
      temperature: 0.3, // Slightly increased for better question diversity
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