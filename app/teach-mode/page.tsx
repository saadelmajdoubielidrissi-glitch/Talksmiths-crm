'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────
interface LessonSection {
  id: number
  step?: string
  title: string
  emoji?: string
  duration: number
  objective?: string
  teacherNote?: string
  content?: { 
    intro?: string; 
    explanation?: string; 
    challenge?: string; 
    readingText?: string;
    caseStudy?: string;
    sceneSetting?: string;
    [key: string]: unknown 
  }
}

interface GeneratedLesson {
  title: string
  subtitle?: string
  level?: string
  industry?: string
  grammarFocus?: string
  situation?: string
  studentProfile?: { name?: string; jobTitle?: string }
  sections: LessonSection[]
}

// ─── Fallback sample lesson ───────────────────────────────────
const SAMPLE_LESSON: GeneratedLesson = {
  title: 'Executive Presentation Skills',
  subtitle: 'Craft openings that command attention from the first word',
  level: 'B2',
  industry: 'Technology & IT',
  grammarFocus: 'Nominalisation for executive authority',
  sections: [
    { id: 1, step: 'Kick-off', emoji: '⚡', title: 'Opening Hook', duration: 5, objective: 'Instantly engage', content: { intro: 'Crafting powerful opening statements that capture attention immediately and set the tone for the entire presentation.' } },
    { id: 2, step: 'Discovery', emoji: '🔍', title: 'Structure Mastery', duration: 10, objective: 'Build narrative', content: { intro: 'The 3-act structure: Problem → Solution → Impact. Every great presentation follows this framework. Your opening must identify a pain point your audience cares about deeply.' } },
    { id: 3, step: 'Introduction to Flow', emoji: '🏗️', title: 'Persuasive Language', duration: 8, objective: 'Language toolkit', content: { explanation: 'Rhetorical devices that influence decisions:\n• Metaphor: "Our roadmap is a bridge, not a ladder."\n• Rule of three: "Fast. Reliable. Scalable."\n• Analogy: Think about your pitch like a product — it needs to solve a problem.' } },
    { id: 4, step: 'Interaction', emoji: '🎭', title: 'Q&A Domination', duration: 7, objective: 'Live simulation', content: { intro: 'The ART method: Acknowledge → Respond → Transition.\nHandling difficult questions with confidence and redirecting the conversation to your key message.' } },
    { id: 5, step: 'Controlled Practice', emoji: '🎯', title: 'Language Application', duration: 10, objective: 'Apply structures', content: { intro: 'Transform these weak sentences into executive-level language using nominalisation and expanded noun phrases:\n\n1. "We made a decision to expand."\n2. "The team agreed to use the new system."\n3. "The results were better than we expected."' } },
    { id: 6, step: 'Creative Production', emoji: '🚀', title: 'Your Final Pitch', duration: 5, objective: 'High-impact delivery', content: { challenge: 'Deliver a 90-second presentation opening on the topic: "Why our team needs a new communication strategy."\n\nYou must include:\n→ One rhetorical question\n→ A striking statistic or fact\n→ Your thesis statement in one powerful sentence' } },
    { id: 7, step: 'Homework', emoji: '📚', title: 'Self-Study', duration: 0, objective: 'Reinforce & apply', content: { intro: '1. Watch a TED Talk and identify the speaker\'s opening technique. Write 3 sentences about it.\n2. Rewrite the opening of your last presentation using today\'s structures.\n3. Record yourself delivering the opening — listen back and self-assess.' } },
  ],
}

const LEVEL_COLORS: Record<string, string> = {
  A2: '#64748b', B1: '#10b981', B2: '#6366f1', C1: '#c49a1a',
}

export default function TeachModePage() {
  const [lesson, setLesson] = useState<GeneratedLesson>(SAMPLE_LESSON)
  const [currentSection, setCurrentSection] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(SAMPLE_LESSON.sections[0].duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const [showNotes, setShowNotes] = useState(false)

  // Load lesson from localStorage if coming from Forge
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ts_teach_lesson')
      if (stored) {
        const parsed: GeneratedLesson = JSON.parse(stored)
        if (parsed.sections && parsed.sections.length > 0) {
          setLesson(parsed)
          setCurrentSection(0)
          setTimeRemaining(parsed.sections[0].duration * 60)
        }
      }
    } catch { /* use sample */ }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeRemaining === 0) return '#ef4444'
    const section = lesson.sections[currentSection]
    const pct = timeRemaining / (section.duration * 60)
    if (pct > 0.4) return '#c49a1a'
    return '#ef4444'
  }

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { setIsRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, timeRemaining])

  const goToSection = useCallback((idx: number) => {
    if (idx < 0 || idx >= lesson.sections.length) return
    setCurrentSection(idx)
    setTimeRemaining(lesson.sections[idx].duration * 60)
    setIsRunning(false)
  }, [lesson.sections])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goToSection(currentSection + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goToSection(currentSection - 1) }
    else if (e.key === 'Enter') { e.preventDefault(); setIsRunning((r) => !r) }
    else if (e.key === 'n' || e.key === 'N') setShowNotes((n) => !n)
    else if (e.key === 'h' || e.key === 'H') setShowNav((n) => !n)
  }, [currentSection, goToSection])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const section = lesson.sections[currentSection]
  const totalDuration = lesson.sections.reduce((acc, s) => acc + s.duration, 0)
  const progress = ((currentSection) / lesson.sections.length) * 100

  const getSectionContentText = () => {
    if (!section.content) return null
    const parts: string[] = []
    if (section.content.intro) parts.push(section.content.intro)
    if (section.content.explanation) parts.push(section.content.explanation)
    if (section.content.challenge) parts.push('🚀 ' + section.content.challenge)
    if (section.content.readingText) parts.push(section.content.readingText)
    if (section.content.caseStudy) parts.push(section.content.caseStudy)
    if (section.content.sceneSetting) parts.push('📍 Scene: ' + section.content.sceneSetting)
    return parts.join('\n\n') || null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', color: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>

      {/* Header Bar */}
      <div style={{ background: 'rgba(14,16,28,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)', flexWrap: 'wrap' }}>
        <button onClick={() => window.close()} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
          ← Back
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>{lesson.title}</div>
          {lesson.studentProfile?.name && <div style={{ fontSize: 11, color: '#64748b' }}>Student: {lesson.studentProfile.name} {lesson.studentProfile.jobTitle && `· ${lesson.studentProfile.jobTitle}`}</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {lesson.level && (
            <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: (LEVEL_COLORS[lesson.level] || '#64748b') + '20', color: LEVEL_COLORS[lesson.level] || '#64748b', border: `1px solid ${(LEVEL_COLORS[lesson.level] || '#64748b')}35` }}>
              {lesson.level}
            </span>
          )}
          <div style={{ fontSize: 11, color: '#475569' }}>{totalDuration} min total</div>
          <button onClick={() => setShowNav(!showNav)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#64748b', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
            {showNav ? 'Hide Nav (H)' : 'Show Nav (H)'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.04)' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #0d7a7e, #0fa3a8)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: showNav ? '240px 1fr' : '1fr', maxWidth: '100%', overflow: 'hidden' }}>

        {/* Sidebar Nav */}
        {showNav && (
          <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            style={{ background: 'rgba(10,12,22,0.98)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: 12 }}>Lesson Sections</div>
            {lesson.sections.map((sec, i) => (
              <button
                key={sec.id}
                onClick={() => goToSection(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: currentSection === i ? 'rgba(13,122,126,0.15)' : 'transparent',
                  borderLeft: currentSection === i ? '2px solid #0d7a7e' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (currentSection !== i) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (currentSection !== i) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{sec.emoji || '📌'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: currentSection === i ? '#2dd4bf' : '#94a3b8', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sec.title}</div>
                  {sec.duration > 0 && <div style={{ fontSize: 10, color: '#475569' }}>{sec.duration} min</div>}
                </div>
                {i < currentSection && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, flexShrink: 0 }}>✓</span>}
              </button>
            ))}
          </motion.aside>
        )}

        {/* Main Stage */}
        <main style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Timer Bar */}
          <div style={{ background: 'rgba(14,16,28,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0d7a7e', marginBottom: 4 }}>
                Step {section.id} of {lesson.sections.length} — {section.step}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-serif), serif', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                {section.emoji} {section.title}
              </div>
              {section.objective && (
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Objective: {section.objective}</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ fontSize: 48, fontWeight: 900, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color: getTimerColor(), fontFamily: 'var(--font-serif), serif', lineHeight: 1 }}>
                {section.duration > 0 ? formatTime(timeRemaining) : '∞'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setIsRunning(!isRunning)}
                  style={{ padding: '8px 18px', background: isRunning ? 'rgba(239,68,68,0.15)' : 'rgba(13,122,126,0.15)', border: `1px solid ${isRunning ? 'rgba(239,68,68,0.3)' : 'rgba(13,122,126,0.3)'}`, borderRadius: 10, color: isRunning ? '#f87171' : '#2dd4bf', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {isRunning ? '⏸ Pause' : '▶ Start'} <span style={{ opacity: 0.5, fontSize: 11 }}>(Enter)</span>
                </button>
                <button onClick={() => { setTimeRemaining(section.duration * 60); setIsRunning(false) }}
                  style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                  ↺
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentSection} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

                {/* Teacher Note */}
                {showNotes && section.teacherNote && (
                  <div style={{ background: 'rgba(196,154,26,0.07)', border: '1px solid rgba(196,154,26,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#b8a060', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: '#c49a1a' }}>📋 Teacher Note: </span>{section.teacherNote}
                  </div>
                )}

                {/* Content */}
                <div style={{ background: 'rgba(14,16,28,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px 36px', minHeight: '320px' }}>
                  {getSectionContentText() ? (
                    <p style={{ fontSize: 16, color: '#e2e8f0', lineHeight: 1.85, whiteSpace: 'pre-line', fontFamily: 'var(--font-serif), serif' }}>
                      {getSectionContentText()}
                    </p>
                  ) : (
                    <p style={{ fontSize: 14, color: '#475569', fontStyle: 'italic' }}>Content for this section is available in detailed view. Open this lesson from the Forge for full exercise content.</p>
                  )}
                </div>

                {/* Grammar focus */}
                {lesson.grammarFocus && currentSection === 2 && (
                  <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 12, padding: '16px 20px', marginTop: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#818cf8', marginBottom: 6 }}>Grammar Focus</div>
                    <div style={{ fontSize: 14, color: '#c7d2fe' }}>{lesson.grammarFocus}</div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div style={{ background: 'rgba(14,16,28,0.9)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => goToSection(currentSection - 1)} disabled={currentSection === 0}
                style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: currentSection === 0 ? '#2d3748' : '#94a3b8', fontSize: 13, fontWeight: 600, cursor: currentSection === 0 ? 'not-allowed' : 'pointer' }}>
                ← Previous
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flex: 1 }}>
              {lesson.sections.map((_, i) => (
                <button key={i} onClick={() => goToSection(i)}
                  style={{ width: i === currentSection ? 28 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', background: i === currentSection ? '#0d7a7e' : i < currentSection ? '#0d7a7e50' : 'rgba(255,255,255,0.1)', transition: 'all 0.25s ease' }} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNotes(!showNotes)}
                style={{ padding: '10px 16px', background: showNotes ? 'rgba(196,154,26,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showNotes ? 'rgba(196,154,26,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, color: showNotes ? '#c49a1a' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                📋 Notes (N)
              </button>
              <button onClick={() => goToSection(currentSection + 1)} disabled={currentSection === lesson.sections.length - 1}
                style={{ padding: '10px 20px', background: currentSection === lesson.sections.length - 1 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #0d7a7e, #0fa3a8)', border: 'none', borderRadius: 10, color: currentSection === lesson.sections.length - 1 ? '#2d3748' : 'white', fontSize: 13, fontWeight: 700, cursor: currentSection === lesson.sections.length - 1 ? 'not-allowed' : 'pointer' }}>
                Next →
              </button>
            </div>
          </div>

          {/* Keyboard hints */}
          <div style={{ textAlign: 'center', padding: '8px', fontSize: 10, color: '#1e293b', letterSpacing: '0.05em' }}>
            ← → Navigate &nbsp;|&nbsp; Space: Next &nbsp;|&nbsp; Enter: Start/Stop Timer &nbsp;|&nbsp; N: Teacher Notes &nbsp;|&nbsp; H: Toggle Nav
          </div>
        </main>
      </div>
    </div>
  )
}
