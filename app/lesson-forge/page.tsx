'use client'

import { useState, useRef } from 'react'
import './styles/forge.css'

// ─── Types ───────────────────────────────────────────────────
interface StudentProfile {
  name: string
  jobTitle: string
  company: string
  industry: string
  level: string
  duration: number
}

interface VocabItem {
  term: string
  definition: string
  exampleSentence: string
}

interface ExerciseItem {
  original?: string
  modelAnswer?: string
  hint?: string
  term?: string
  definition?: string
  question?: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
  context?: string
  category?: string
  answer?: string
  speaker?: string
  line?: string
  task?: string
  why?: string
}

interface Exercise {
  type: string
  instruction: string
  passage?: string
  answers?: string[]
  items?: ExerciseItem[]
}

interface SectionContent {
  intro?: string
  readingTitle?: string
  readingText?: string
  explanation?: string
  sceneSetting?: string
  characterA?: string
  characterB?: string
  roleplayObjectives?: string[]
  scriptStarter?: ExerciseItem[]
  caseStudy?: string
  challenge?: string
  requiredElements?: string[]
  tasks?: ExerciseItem[]
  exercises?: Exercise[]
}

interface LessonSection {
  id: number
  step: string
  title: string
  emoji: string
  duration: number
  objective: string
  teacherNote?: string
  content: SectionContent
}

interface GeneratedLesson {
  id: string
  title: string
  subtitle: string
  level: string
  duration: number
  industry: string
  grammarFocus: string
  targetVocabulary: VocabItem[]
  sections: LessonSection[]
  situation: string
  generatedAt: string
  studentProfile: StudentProfile
}

// ─── Suggestion prompts ───────────────────────────────────────
const SITUATION_SUGGESTIONS = [
  'How to manage a dispute between two colleagues',
  'How to negotiate a salary increase confidently',
  'How to present bad news to senior management',
  'How to lead a meeting when people keep interrupting',
  'How to push back on unrealistic deadlines from my boss',
  'How to give critical feedback to an underperforming team member',
  'How to persuade a skeptical client to accept our proposal',
  'How to run a successful job interview in English',
]

const INDUSTRIES = [
  'Banking & Fintech', 'Technology & IT', 'Healthcare & Pharma',
  'Legal & Consulting', 'BPO & Customer Experience', 'Automotive & Manufacturing',
  'Energy & Sustainability', 'Hospitality & Tourism', 'Retail & E-Commerce',
  'Media & Advertising', 'Real Estate', 'Education', 'Logistics & Supply Chain',
  'NGO & Public Sector',
]

const LEVELS = [
  { value: 'A2', label: 'A2 — Elementary' },
  { value: 'B1', label: 'B1 — Intermediate' },
  { value: 'B2', label: 'B2 — Upper-Intermediate' },
  { value: 'C1', label: 'C1 — Advanced' },
]

const DURATIONS = [
  { value: '60', label: '60 min — Power Session' },
  { value: '75', label: '75 min — Standard' },
  { value: '90', label: '90 min — Full Session' },
  { value: '120', label: '120 min — Deep Dive' },
]

const LOADING_STEPS = [
  'Analysing your situation...',
  'Researching industry context...',
  'Designing the 7-step framework...',
  'Building exercises & roleplay...',
  'Calibrating to your CEFR level...',
  'Forging your lesson...',
]

const LEVEL_COLORS: Record<string, string> = {
  A2: '#64748b', B1: '#10b981', B2: '#6366f1', C1: '#c49a1a',
}

// ─── Section Renderer ─────────────────────────────────────────
function SectionCard({ section }: { section: LessonSection }) {
  const [open, setOpen] = useState(section.id <= 2)

  return (
    <div className="forge-section-card">
      <div className="forge-section-header" onClick={() => setOpen(!open)} role="button" aria-expanded={open}>
        <div className="forge-step-number">{section.emoji}</div>
        <div className="forge-section-info">
          <div className="forge-section-step-label">Step {section.id} — {section.step}</div>
          <div className="forge-section-title">{section.title}</div>
        </div>
        {section.duration > 0 && (
          <div className="forge-section-duration">{section.duration} min</div>
        )}
        <span style={{ color: '#64748b', fontSize: 18, marginLeft: 8, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </div>

      {open && (
        <div className="forge-section-body">
          {/* Objective */}
          <div className="forge-objective-box">
            <strong>Objective:</strong> {section.objective}
          </div>

          {/* Teacher Note */}
          {section.teacherNote && (
            <div className="forge-teacher-note">{section.teacherNote}</div>
          )}

          {/* Content */}
          <ContentRenderer content={section.content} step={section.step} />
        </div>
      )}
    </div>
  )
}

function ContentRenderer({ content, step }: { content: SectionContent; step: string }) {
  return (
    <div>
      {content.intro && (
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>{content.intro}</p>
      )}

      {/* Reading Text */}
      {content.readingTitle && (
        <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#818cf8', marginBottom: 8 }}>Reading Passage</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 12 }}>{content.readingTitle}</div>
          {content.readingText && (
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{content.readingText}</p>
          )}
        </div>
      )}

      {/* Grammar Explanation */}
      {content.explanation && (
        <div className="forge-grammar-box">
          <div className="forge-grammar-label">📐 Language Focus</div>
          <div className="forge-grammar-content" style={{ whiteSpace: 'pre-line' }}>{content.explanation}</div>
        </div>
      )}

      {/* Case Study */}
      {content.caseStudy && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 10 }}>Case Study</div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{content.caseStudy}</p>
        </div>
      )}

      {/* Roleplay Scene */}
      {step === 'Interaction' && content.sceneSetting && (
        <div>
          <div className="forge-roleplay-scene">
            <div className="forge-roleplay-label">🎬 Scene</div>
            <p>{content.sceneSetting}</p>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(13,122,126,0.08)', border: '1px solid rgba(13,122,126,0.2)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0d7a7e', marginBottom: 4 }}>You (Character A)</div>
              <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 500 }}>{content.characterA}</div>
            </div>
            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 4 }}>Character B</div>
              <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 500 }}>{content.characterB}</div>
            </div>
          </div>

          {content.roleplayObjectives && content.roleplayObjectives.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Your Goals in This Roleplay:</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {content.roleplayObjectives.map((goal, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                    <span style={{ color: '#0d7a7e', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.scriptStarter && content.scriptStarter.length > 0 && (
            <div style={{ background: 'rgba(10,18,32,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 12 }}>Script Starter</div>
              {content.scriptStarter.map((line, i) => (
                <div key={i} className="forge-script-line">
                  <span className={`forge-speaker-tag ${line.speaker?.includes('A') || line.speaker?.includes('You') ? 'you' : 'other'}`}>
                    {line.speaker?.includes('A') || line.speaker?.includes('You') ? '🟢' : '⚪'} {line.speaker}
                  </span>
                  <span className="forge-script-text">"{line.line}"</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Creative Challenge */}
      {content.challenge && (
        <div style={{ background: 'linear-gradient(135deg, rgba(196,154,26,0.08), rgba(234,88,12,0.05))', border: '1px solid rgba(196,154,26,0.2)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c49a1a', marginBottom: 8 }}>🚀 Your Challenge</div>
          <p style={{ fontSize: 14, color: '#fef3c7', lineHeight: 1.7 }}>{content.challenge}</p>
          {content.requiredElements && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>Required elements:</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {content.requiredElements.map((el, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#d97706', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>✓</span> {el}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Homework Tasks */}
      {content.tasks && content.tasks.length > 0 && (
        <div>
          {content.tasks.map((task, i) => (
            <div key={i} className="forge-homework-item">
              <div className="forge-homework-number">{i + 1}</div>
              <div>
                <div className="forge-homework-task">{task.task}</div>
                {task.why && <div className="forge-homework-why">💡 {task.why}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercises */}
      {content.exercises && content.exercises.map((ex, ei) => (
        <ExerciseBlock key={ei} exercise={ex} />
      ))}
    </div>
  )
}

function ExerciseBlock({ exercise }: { exercise: Exercise }) {
  const [showAnswers, setShowAnswers] = useState(false)

  return (
    <div className="forge-exercise">
      <div className="forge-exercise-instruction">{exercise.instruction}</div>

      {/* Fill-in-the-blank */}
      {exercise.type === 'fill-in-the-blank' && exercise.passage && (
        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.9, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 14 }}>
            {exercise.passage.split('[BLANK]').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="forge-answer-blank">
                    {showAnswers && exercise.answers ? exercise.answers[i] : `(${i + 1})`}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Rewrite / Transformation */}
      {(exercise.type === 'rewrite' || exercise.type === 'transformation') && exercise.items?.map((item, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div className="forge-exercise-item source">
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginRight: 8 }}>{i + 1}.</span>
            {item.original}
            {item.hint && <span style={{ marginLeft: 8, fontSize: 11, color: '#0d7a7e', fontStyle: 'italic' }}>({item.hint})</span>}
          </div>
          {showAnswers && item.modelAnswer && (
            <div className="forge-exercise-item answer">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0d7a7e', marginRight: 8 }}>→</span>
              {item.modelAnswer}
            </div>
          )}
          {!showAnswers && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, color: '#475569', fontSize: 12, fontStyle: 'italic' }}>
              Your answer here...
            </div>
          )}
        </div>
      ))}

      {/* Vocabulary Match */}
      {exercise.type === 'vocabulary-match' && exercise.items?.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ minWidth: 140, fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{item.term}</span>
          {showAnswers && <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{item.definition}</span>}
          {!showAnswers && <span style={{ fontSize: 13, color: '#475569', fontStyle: 'italic' }}>definition hidden...</span>}
        </div>
      ))}

      {/* Comprehension */}
      {exercise.type === 'comprehension' && exercise.items?.map((item, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 500, marginBottom: 6 }}>{i + 1}. {item.question}</div>
          {showAnswers ? (
            <div className="forge-exercise-item answer">{item.modelAnswer}</div>
          ) : (
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, color: '#475569', fontSize: 12, fontStyle: 'italic' }}>Your answer...</div>
          )}
        </div>
      ))}

      {/* Matching */}
      {exercise.type === 'matching' && exercise.items?.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ minWidth: 180, fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{item.term}</span>
          {showAnswers && <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>→ {item.definition}</span>}
          {!showAnswers && <span style={{ fontSize: 13, color: '#475569', fontStyle: 'italic' }}>[ ]</span>}
        </div>
      ))}

      {/* Identify */}
      {exercise.type === 'identify' && exercise.items?.map((item, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>{item.category}:</div>
          {showAnswers ? (
            <div className="forge-exercise-item answer">{item.answer}</div>
          ) : (
            <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 12, color: '#475569', fontStyle: 'italic' }}>Find it in the text...</div>
          )}
        </div>
      ))}

      {/* Nuance choice */}
      {exercise.type === 'nuance-choice' && exercise.items?.map((item, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          {item.context && <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, lineHeight: 1.6 }}>{item.context}</p>}
          {item.options && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              {item.options.map((opt: string, oi: number) => (
                <span key={oi} style={{ padding: '6px 14px', border: `1px solid ${showAnswers && opt === item.correctAnswer ? 'rgba(13,122,126,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, fontSize: 13, color: showAnswers && opt === item.correctAnswer ? '#2dd4bf' : '#94a3b8', background: showAnswers && opt === item.correctAnswer ? 'rgba(13,122,126,0.1)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {opt}
                </span>
              ))}
            </div>
          )}
          {showAnswers && item.explanation && (
            <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', lineHeight: 1.6, padding: '8px 12px', background: 'rgba(13,122,126,0.05)', borderRadius: 8 }}>
              💡 {item.explanation}
            </div>
          )}
        </div>
      ))}

      {/* Toggle Answers */}
      <button
        onClick={() => setShowAnswers(!showAnswers)}
        style={{ marginTop: 12, padding: '7px 16px', background: showAnswers ? 'rgba(13,122,126,0.15)' : 'rgba(255,255,255,0.04)', border: '1px solid ' + (showAnswers ? 'rgba(13,122,126,0.3)' : 'rgba(255,255,255,0.08)'), borderRadius: 8, fontSize: 12, fontWeight: 600, color: showAnswers ? '#2dd4bf' : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}
      >
        {showAnswers ? '👁 Hide Answers' : '👁 Show Model Answers'}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function LessonForgePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    jobTitle: '',
    company: '',
    industry: '',
    level: 'B2',
    duration: 90,
  })
  const [situation, setSituation] = useState('')
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const lessonRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!situation.trim() || situation.trim().length < 10) {
      setError('Please describe your situation in more detail (at least a sentence).')
      return
    }
    setError(null)
    setIsLoading(true)
    setLesson(null)
    setLoadingStep(0)

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
    }, 1800)

    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, situation }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setLesson(data.lesson)
      setTimeout(() => lessonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      clearInterval(stepInterval)
      setIsLoading(false)
    }
  }

  const handleSaveToLibrary = () => {
    if (!lesson) return
    const saved = JSON.parse(localStorage.getItem('ts_saved_lessons') || '[]')
    saved.unshift({ ...lesson, savedAt: new Date().toISOString() })
    localStorage.setItem('ts_saved_lessons', JSON.stringify(saved.slice(0, 50)))
    alert('✅ Lesson saved to your library!')
  }

  const handleTeachMode = () => {
    if (!lesson) return
    localStorage.setItem('ts_teach_lesson', JSON.stringify(lesson))
    window.open('/teach-mode', '_blank')
  }

  return (
    <div className="forge-root">
      {/* Hero */}
      <div className="forge-hero">
        <div className="forge-hero-badge">
          <span>⚡</span> IDEA Methodology™ — Infinite Lesson Engine
        </div>
        <h1>Forge Any Lesson.<br />Any Topic. Any Industry.</h1>
        <p>Describe your professional situation and we'll generate a complete, personalised Business English lesson—powered by your profile and industry context.</p>
      </div>

      <div className="forge-layout">
        {/* ── Form Panel ── */}
        <aside className="forge-form-card">
          {/* Profile */}
          <div className="forge-section-label">👤 Student Profile</div>

          <div className="forge-field">
            <label>Your Name</label>
            <input className="forge-input" placeholder="e.g. Sarah Amrani" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          </div>

          <div className="forge-field">
            <label>Job Title *</label>
            <input className="forge-input" placeholder="e.g. Head of Operations" value={profile.jobTitle} onChange={e => setProfile({ ...profile, jobTitle: e.target.value })} />
          </div>

          <div className="forge-field">
            <label>Company</label>
            <input className="forge-input" placeholder="e.g. Attijariwafa Bank" value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })} />
          </div>

          <div className="forge-field">
            <label>Industry *</label>
            <select className="forge-select" value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })}>
              <option value="">Select your industry</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="forge-field">
              <label>CEFR Level</label>
              <select className="forge-select" value={profile.level} onChange={e => setProfile({ ...profile, level: e.target.value })}>
                {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="forge-field">
              <label>Duration</label>
              <select className="forge-select" value={profile.duration} onChange={e => setProfile({ ...profile, duration: Number(e.target.value) })}>
                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0 20px' }} />

          {/* Situation */}
          <div className="forge-section-label">🎯 Your Situation</div>

          <div className="forge-field">
            <label>Describe your workplace challenge or topic *</label>
            <textarea
              className="forge-textarea"
              placeholder="e.g. 'I need to manage a conflict between two senior engineers who disagree on a technical approach and it's affecting the whole team's morale...'"
              value={situation}
              onChange={e => setSituation(e.target.value)}
              rows={5}
            />
          </div>

          <div className="forge-suggestions">
            {SITUATION_SUGGESTIONS.slice(0, 4).map((s, i) => (
              <button key={i} className="forge-suggestion-chip" onClick={() => setSituation(s)}>
                {s.length > 45 ? s.slice(0, 45) + '...' : s}
              </button>
            ))}
          </div>

          {error && (
            <div className="forge-error" style={{ marginTop: 16 }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            id="forge-generate-btn"
            className={`forge-generate-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleGenerate}
            disabled={isLoading}
            style={{ marginTop: 20 }}
          >
            {isLoading ? (
              <>
                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'forge-spin 0.6s linear infinite', flexShrink: 0 }} />
                Generating…
              </>
            ) : (
              <>⚡ Forge My Lesson</>
            )}
          </button>
        </aside>

        {/* ── Output Panel ── */}
        <main>
          {isLoading && (
            <div className="forge-loading">
              <div className="forge-loading-spinner" />
              <div className="forge-loading-steps">
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} className={`forge-loading-step ${i === loadingStep ? 'active' : i < loadingStep ? '' : ''}`}
                    style={{ opacity: i < loadingStep ? 0.4 : i === loadingStep ? 1 : 0.3 }}>
                    {i < loadingStep ? '✓ ' : i === loadingStep ? '→ ' : '  '}{step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !lesson && (
            <div className="forge-empty-state">
              <div className="forge-empty-icon">⚡</div>
              <h2>Your Lesson Awaits</h2>
              <p>Fill in your profile and describe your situation on the left. The AI will forge a complete {profile.duration}-minute lesson following the IDEA Methodology™—personalised to your industry and role.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                {SITUATION_SUGGESTIONS.slice(4).map((s, i) => (
                  <button key={i} className="forge-suggestion-chip" onClick={() => setSituation(s)} style={{ fontSize: 12 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLoading && lesson && (
            <div className="forge-lesson" ref={lessonRef}>
              {/* Header */}
              <div className="forge-lesson-header">
                <div className="forge-lesson-meta">
                  <span className="forge-meta-tag" style={{ background: LEVEL_COLORS[lesson.level] + '20', color: LEVEL_COLORS[lesson.level], border: `1px solid ${LEVEL_COLORS[lesson.level]}40` }}>
                    {lesson.level}
                  </span>
                  <span className="forge-meta-tag" style={{ background: 'rgba(13,122,126,0.12)', color: '#2dd4bf', border: '1px solid rgba(13,122,126,0.25)' }}>
                    {lesson.duration} min
                  </span>
                  <span className="forge-meta-tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {lesson.industry}
                  </span>
                  {lesson.studentProfile?.jobTitle && (
                    <span className="forge-meta-tag" style={{ background: 'rgba(196,154,26,0.1)', color: '#c49a1a', border: '1px solid rgba(196,154,26,0.2)' }}>
                      {lesson.studentProfile.jobTitle}
                    </span>
                  )}
                </div>
                <div className="forge-lesson-title">{lesson.title}</div>
                <div className="forge-lesson-subtitle">{lesson.subtitle}</div>

                {lesson.grammarFocus && (
                  <div style={{ fontSize: 13, color: '#818cf8', marginBottom: 20 }}>
                    <span style={{ fontWeight: 600 }}>Grammar Focus:</span> {lesson.grammarFocus}
                  </div>
                )}

                <div className="forge-lesson-actions">
                  <button id="teach-mode-btn" className="forge-action-btn primary" onClick={handleTeachMode}>▶ Launch Teach Mode</button>
                  <button id="save-lesson-btn" className="forge-action-btn secondary" onClick={handleSaveToLibrary}>💾 Save to My Library</button>
                  <button id="print-lesson-btn" className="forge-action-btn secondary" onClick={() => window.print()}>🖨 Print / PDF</button>
                </div>
              </div>

              {/* Vocabulary */}
              {lesson.targetVocabulary && lesson.targetVocabulary.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.07em' }}>📖 Target Vocabulary ({lesson.targetVocabulary.length} items)</div>
                  <div className="forge-vocab-grid">
                    {lesson.targetVocabulary.map((v, i) => (
                      <div key={i} className="forge-vocab-card">
                        <div className="forge-vocab-term">{v.term}</div>
                        <div className="forge-vocab-def">{v.definition}</div>
                        {v.exampleSentence && <div className="forge-vocab-example">"{v.exampleSentence}"</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              {lesson.sections?.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
