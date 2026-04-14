import { Metadata } from 'next'
import { LessonOSPreview } from '../components/LessonOSPreview'
import { GlowCard } from '../components/GlowCard'
import { ShimmerButton } from '../components/ShimmerButton'

export const metadata: Metadata = {
  title: 'LessonOS Platform',
}

const PlatformPage = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl md:text-6xl font-serif text-center mb-6 text-navy dark:text-white">
        LessonOS Platform
      </h1>
      
      <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
        AI-powered lesson generation. Teach Mode. PDF export. Everything you need to forge elite communicators.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <GlowCard delay={0.1}>
          <h3 className="text-2xl font-serif text-teal mb-4">🤖 AI Lesson Generation</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Generate lessons from any topic in seconds</li>
            <li>✓ Industry-specific content calibration</li>
            <li>✓ Difficulty level auto-adjustment</li>
            <li>✓ Moroccan business context integration</li>
          </ul>
        </GlowCard>
        
        <GlowCard delay={0.2}>
          <h3 className="text-2xl font-serif text-teal mb-4">🎨 Teach Mode</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Distraction-free dark interface</li>
            <li>✓ Section countdown timers</li>
            <li>✓ Keyboard navigation support</li>
            <li>✓ Live annotation tools</li>
          </ul>
        </GlowCard>
        
        <GlowCard delay={0.3}>
          <h3 className="text-2xl font-serif text-teal mb-4">📄 Export Capabilities</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Professional PDF generation</li>
            <li>✓ Custom branding integration</li>
            <li>✓ Student handout mode</li>
            <li>✓ Assessment worksheet export</li>
          </ul>
        </GlowCard>
        
        <GlowCard delay={0.4}>
          <h3 className="text-2xl font-serif text-teal mb-4">📊 Analytics Dashboard</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Real-time progress tracking</li>
            <li>✓ Skill gap analysis</li>
            <li>✓ ROI measurement tools</li>
            <li>✓ Custom report generation</li>
          </ul>
        </GlowCard>
      </div>
      
      <LessonOSPreview />
      
      <div className="text-center mt-16">
        <ShimmerButton href="/teach-mode">Launch Teach Mode</ShimmerButton>
      </div>
    </div>
  )
}

export default PlatformPage
