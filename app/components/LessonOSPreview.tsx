'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlowCard } from './GlowCard'

const sampleLesson = {
  title: 'Executive Presentation Skills',
  sections: [
    { id: 1, title: 'Opening Hook', duration: 5, content: 'Crafting powerful opening statements' },
    { id: 2, title: 'Structure Mastery', duration: 10, content: 'The 3-act structure for business presentations' },
    { id: 3, title: 'Persuasive Language', duration: 8, content: 'Rhetorical devices that influence decisions' },
    { id: 4, title: 'Q&A Domination', duration: 7, content: 'Handling difficult questions with confidence' },
  ]
}

export const LessonOSPreview = () => {
  const [selectedSection, setSelectedSection] = useState(0)

  return (
    <GlowCard className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-serif text-navy dark:text-white mb-6">LessonOS: AI-Powered Lesson Engine</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-teal mb-4">{sampleLesson.title}</h4>
          <div className="space-y-3">
            {sampleLesson.sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedSection === i ? 'bg-teal/10 border border-teal/30' : 'hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
                onClick={() => setSelectedSection(i)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{section.title}</span>
                  <span className="text-sm text-gold">{section.duration} min</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-lg">
          <h5 className="font-semibold mb-3">Preview</h5>
          <p className="text-gray-700 dark:text-gray-300">
            {sampleLesson.sections[selectedSection].content}
          </p>
          <div className="mt-4 flex gap-2">
            <span className="text-xs px-2 py-1 bg-teal/20 text-teal rounded">AI Generated</span>
            <span className="text-xs px-2 py-1 bg-gold/20 text-gold rounded">Customizable</span>
          </div>
        </div>
      </div>
    </GlowCard>
  )
}
