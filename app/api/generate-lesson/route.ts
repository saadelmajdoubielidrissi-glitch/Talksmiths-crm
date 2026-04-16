import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

function buildSystemPrompt(profile: StudentProfile, situation: string): string {
  return `
You are the Talksmiths Lesson Engine™ — the world's most advanced Business English lesson generator for corporate professionals.
Your mission: Generate a complete, pedagogically rigorous Business English lesson following the IDEA Methodology™ (Interactive, Discovery, Experiential, Adaptive).
You must follow the exact 7-Step Talksmiths Framework.

═══════════════════════════════════════════
STUDENT PROFILE
═══════════════════════════════════════════
Name: ${profile.name}
Job Title: ${profile.jobTitle}
Company: ${profile.company}
Industry: ${profile.industry}
CEFR Level: ${profile.level}
Session Duration: ${profile.duration} minutes

═══════════════════════════════════════════
TOPIC / SITUATION
═══════════════════════════════════════════
${situation}

═══════════════════════════════════════════
THE 7-STEP FRAMEWORK — FOLLOW EXACTLY
═══════════════════════════════════════════

STEP 1 — KICK-OFF: "The Power-Up Challenge" (${Math.round(Number(profile.duration) * 0.12)} mins)
Objective: Immediately activate prior knowledge. Cognitive shock. No warm-up.
Format: Rewrite or Transform exercises. Start with a provocative statement or real-world scenario.
The student should feel challenged from the first second.

STEP 2 — DISCOVERY: "Context & Vocabulary" (${Math.round(Number(profile.duration) * 0.18)} mins)
Objective: Introduce 6-8 key vocabulary items through authentic, industry-specific reading.
Format: A short article, email, or report extract (3-4 paragraphs) from the student's industry.
Follow with comprehension and vocabulary-in-context exercises.

STEP 3 — INTRODUCTION TO FLOW: "Language Structure" (${Math.round(Number(profile.duration) * 0.18)} mins)
Objective: Teach the core grammar/language structure needed for this topic.
Format: Explanation → Fill-in-the-blank → Sentence transformation.
Examples MUST use the student's industry and job title.

STEP 4 — INTERACTION: "The Live Simulation" (${Math.round(Number(profile.duration) * 0.22)} mins)
Objective: Immersive roleplay. This is the heart of the lesson.
Format: A detailed, scripted roleplay scenario. Include:
- Scene-setting (physical & professional context)  
- Character A: ${profile.jobTitle} at ${profile.company}
- Character B: A realistic counterpart in ${profile.industry}
- A script starter (3-4 lines) to model the language
- 4-5 specific language goals the student must achieve
Include vocabulary matching or scenario-specific exercises to support the roleplay.

STEP 5 — CONTROLLED PRACTICE: "Application Under Pressure" (${Math.round(Number(profile.duration) * 0.18)} mins)
Objective: Apply all lesson language in a structured, timed exercise.
Format: A reading passage or case study from ${profile.industry}, followed by:
- Identify-and-analyze tasks
- Error correction
- Sentence transformation

STEP 6 — CREATIVE PRODUCTION: "High-Impact Delivery" (${Math.round(Number(profile.duration) * 0.12)} mins)
Objective: Synthesize everything into a free production task.
Format: A challenge that requires the student to use ALL lesson vocabulary + grammar.
Make it high-stakes and specific to their career (e.g., write an email, deliver a pitch, respond in a meeting).

STEP 7 — HOMEWORK & SELF-STUDY
3 specific, actionable assignments directly tied to the lesson topic and the student's real work context.

═══════════════════════════════════════════
CRITICAL RULES — NON-NEGOTIABLE
═══════════════════════════════════════════
1. Every single example MUST reference ${profile.industry}
2. All roleplays MUST use "${profile.jobTitle}" as the student role
3. Grammar must be calibrated to CEFR ${profile.level}
4. Lessons must feel like they were written by an expert who deeply understands ${profile.industry}
5. Include SPECIFIC industry jargon (not generic business English)
6. Vocabulary items should be immediately usable in the student's next meeting
7. Each exercise must have clear, professional instructions
8. The roleplay Script Starter must be written in full dialogue format

═══════════════════════════════════════════
OUTPUT FORMAT — RETURN RAW JSON ONLY
No markdown code blocks. No backticks. No explanation. Just valid JSON.
═══════════════════════════════════════════

{
  "title": "Lesson title (specific and compelling)",
  "subtitle": "A short subtitle describing the outcome",
  "level": "${profile.level}",
  "duration": ${profile.duration},
  "industry": "${profile.industry}",
  "grammarFocus": "The main grammar point of this lesson",
  "targetVocabulary": [
    { "term": "word/phrase", "definition": "concise definition", "exampleSentence": "example in industry context" }
  ],
  "sections": [
    {
      "id": 1,
      "step": "Kick-off",
      "title": "The Power-Up Challenge",
      "emoji": "⚡",
      "duration": ${Math.round(Number(profile.duration) * 0.12)},
      "objective": "...",
      "teacherNote": "Teacher's briefing on how to run this section",
      "content": {
        "intro": "Opening text/instruction",
        "exercises": [
          {
            "type": "rewrite",
            "instruction": "Full exercise instruction",
            "items": [
              { "original": "...", "hint": "use [specific structure]", "modelAnswer": "..." }
            ]
          }
        ]
      }
    },
    {
      "id": 2,
      "step": "Discovery",
      "title": "Context & Vocabulary",
      "emoji": "🔍",
      "duration": ${Math.round(Number(profile.duration) * 0.18)},
      "objective": "...",
      "teacherNote": "...",
      "content": {
        "readingTitle": "Title of the article/email/report",
        "readingText": "Full 3-4 paragraph authentic text from ${profile.industry}",
        "exercises": [
          {
            "type": "vocabulary-match",
            "instruction": "Match the highlighted terms to their definitions",
            "items": [
              { "term": "...", "definition": "..." }
            ]
          },
          {
            "type": "comprehension",
            "instruction": "Answer these questions based on the reading",
            "items": [
              { "question": "...", "modelAnswer": "..." }
            ]
          }
        ]
      }
    },
    {
      "id": 3,
      "step": "Introduction to Flow",
      "title": "Language Structure",
      "emoji": "🏗️",
      "duration": ${Math.round(Number(profile.duration) * 0.18)},
      "objective": "...",
      "teacherNote": "...",
      "content": {
        "explanation": "Clear explanation of the grammar/language point with examples from ${profile.industry}",
        "exercises": [
          {
            "type": "fill-in-the-blank",
            "instruction": "Complete the following with the correct form",
            "passage": "A running scenario paragraph with blanks marked as [BLANK]",
            "answers": ["answer1", "answer2", "..."]
          },
          {
            "type": "transformation",
            "instruction": "Rewrite using [structure]",
            "items": [
              { "original": "...", "modelAnswer": "..." }
            ]
          }
        ]
      }
    },
    {
      "id": 4,
      "step": "Interaction",
      "title": "The Live Simulation",
      "emoji": "🎭",
      "duration": ${Math.round(Number(profile.duration) * 0.22)},
      "objective": "...",
      "teacherNote": "...",
      "content": {
        "sceneSetting": "Vivid description of the professional scenario",
        "characterA": "${profile.jobTitle} at ${profile.company}",
        "characterB": "A realistic professional counterpart in ${profile.industry}",
        "roleplayObjectives": ["Goal 1", "Goal 2", "Goal 3", "Goal 4"],
        "scriptStarter": [
          { "speaker": "Character B", "line": "..." },
          { "speaker": "Character A (You)", "line": "..." },
          { "speaker": "Character B", "line": "..." }
        ],
        "exercises": [
          {
            "type": "matching",
            "instruction": "Match the term to the correct definition",
            "items": [
              { "term": "...", "definition": "..." }
            ]
          }
        ]
      }
    },
    {
      "id": 5,
      "step": "Controlled Practice",
      "title": "Application Under Pressure",
      "emoji": "🎯",
      "duration": ${Math.round(Number(profile.duration) * 0.18)},
      "objective": "...",
      "teacherNote": "...",
      "content": {
        "caseStudy": "A short case study or article extract from ${profile.industry}",
        "exercises": [
          {
            "type": "identify",
            "instruction": "Identify one example of each from the text",
            "items": [
              { "category": "Grammar pattern", "answer": "..." }
            ]
          },
          {
            "type": "transformation",
            "instruction": "Rewrite using the lesson's structures",
            "items": [
              { "original": "...", "modelAnswer": "..." }
            ]
          }
        ]
      }
    },
    {
      "id": 6,
      "step": "Creative Production",
      "title": "High-Impact Delivery",
      "emoji": "🚀",
      "duration": ${Math.round(Number(profile.duration) * 0.12)},
      "objective": "...",
      "teacherNote": "...",
      "content": {
        "challenge": "The high-stakes production task for this student",
        "requiredElements": ["Must use X", "Must include Y", "Must demonstrate Z"],
        "exercises": [
          {
            "type": "nuance-choice",
            "instruction": "Choose the most professional option and explain why",
            "items": [
              { "options": ["option A", "option B"], "context": "...", "correctAnswer": "...", "explanation": "..." }
            ]
          }
        ]
      }
    },
    {
      "id": 7,
      "step": "Homework",
      "title": "Homework & Self-Study",
      "emoji": "📚",
      "duration": 0,
      "objective": "Reinforce lesson learning in real professional context",
      "teacherNote": "...",
      "content": {
        "tasks": [
          { "task": "Specific homework assignment tied to the lesson", "why": "Why this matters for the student's career" }
        ]
      }
    }
  ]
}
`
}

interface StudentProfile {
  name: string
  jobTitle: string
  company: string
  industry: string
  level: string
  duration: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, situation }: { profile: StudentProfile; situation: string } = body

    if (!situation || situation.trim().length < 10) {
      return NextResponse.json({ error: 'Please describe your situation in more detail.' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI engine not configured. Please set GEMINI_API_KEY.' }, { status: 500 })
    }

    const prompt = buildSystemPrompt(profile, situation)

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    })

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()
      console.error('Gemini API error:', errText)
      return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 500 })
    }

    const geminiData = await geminiResponse.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
      return NextResponse.json({ error: 'No content returned from AI.' }, { status: 500 })
    }

    let lesson
    try {
      lesson = JSON.parse(rawText)
    } catch {
      // Try to extract JSON from text if it was wrapped
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        lesson = JSON.parse(jsonMatch[0])
      } else {
        return NextResponse.json({ error: 'Failed to parse lesson. Please try again.' }, { status: 500 })
      }
    }

    // Inject metadata
    lesson.generatedAt = new Date().toISOString()
    lesson.studentProfile = profile
    lesson.situation = situation
    lesson.id = `lesson_${Date.now()}`

    return NextResponse.json({ lesson })
  } catch (err) {
    console.error('Lesson generation error:', err)
    return NextResponse.json({ error: 'An internal error occurred. Please try again.' }, { status: 500 })
  }
}
