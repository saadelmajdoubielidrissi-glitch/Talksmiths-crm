'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

const sampleLesson = {
  title: 'Executive Presentation Skills',
  sections: [
    { id: 1, title: 'Opening Hook', duration: 5, content: "Welcome to today's lesson on crafting powerful opening statements that capture attention immediately." },
    { id: 2, title: 'Structure Mastery', duration: 10, content: 'The 3-act structure: Problem, Solution, Impact. Every great presentation follows this framework.' },
    { id: 3, title: 'Persuasive Language', duration: 8, content: 'Rhetorical devices: Metaphor, analogy, and the rule of three to influence decision-makers.' },
    { id: 4, title: 'Q&A Domination', duration: 7, content: 'The ART method: Acknowledge, Respond, Transition. Handle any question with confidence.' },
  ]
}

export default function TeachModePage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(sampleLesson.sections[0].duration * 60)
  const [isRunning, setIsRunning] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeRemaining])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      if (currentSection < sampleLesson.sections.length - 1) {
        setCurrentSection(currentSection + 1)
        setTimeRemaining(sampleLesson.sections[currentSection + 1].duration * 60)
        setIsRunning(false)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (currentSection > 0) {
        setCurrentSection(currentSection - 1)
        setTimeRemaining(sampleLesson.sections[currentSection - 1].duration * 60)
        setIsRunning(false)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      setIsRunning(!isRunning)
    }
  }, [currentSection, isRunning])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <div className="min-h-screen bg-navy text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-serif">Teach Mode: {sampleLesson.title}</h1>
          <div className="text-4xl font-bold text-gold">{formatTime(timeRemaining)}</div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {sampleLesson.sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                currentSection === i ? 'bg-teal/30 border border-teal' : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => {
                setCurrentSection(i)
                setTimeRemaining(section.duration * 60)
                setIsRunning(false)
              }}
            >
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-sm opacity-75">{section.duration} min</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-12 rounded-xl min-h-96"
        >
          <h2 className="text-2xl font-serif mb-6 text-gold">
            {sampleLesson.sections[currentSection].title}
          </h2>
          <p className="text-lg leading-relaxed">
            {sampleLesson.sections[currentSection].content}
          </p>
        </motion.div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-3 bg-teal rounded-lg font-semibold hover:bg-teal/80 transition-colors"
          >
            {isRunning ? 'Pause' : 'Start'} Timer (Space)
          </button>
          <button
            onClick={() => {
              if (currentSection > 0) {
                setCurrentSection(currentSection - 1)
                setTimeRemaining(sampleLesson.sections[currentSection - 1].duration * 60)
                setIsRunning(false)
              }
            }}
            className="px-6 py-3 bg-white/20 rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            Previous (←)
          </button>
          <button
            onClick={() => {
              if (currentSection < sampleLesson.sections.length - 1) {
                setCurrentSection(currentSection + 1)
                setTimeRemaining(sampleLesson.sections[currentSection + 1].duration * 60)
                setIsRunning(false)
              }
            }}
            className="px-6 py-3 bg-white/20 rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            Next (→)
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Keyboard: ← → Navigate | Space: Play/Pause | Enter: Start/Stop
        </div>
      </div>
    </div>
  )
}
