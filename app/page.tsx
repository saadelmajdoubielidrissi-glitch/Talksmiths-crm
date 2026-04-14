import { Metadata } from 'next'
import { AnimatedHero } from './components/AnimatedHero'
import { ShimmerButton } from './components/ShimmerButton'
import { LessonOSPreview } from './components/LessonOSPreview'
import { GlowCard } from './components/GlowCard'

export const metadata: Metadata = {
  title: 'Home',
}

const HomePage = () => {
  return (
    <>
      <AnimatedHero
        title="Speak the Language of Success"
        subtitle="Forge elite communicators. Transform your enterprise with the IDEA Methodology™—where Moroccan expertise meets global business standards."
        cta={
          <ShimmerButton href="/contact">
            Book Your Demo
          </ShimmerButton>
        }
      />
      
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-navy dark:text-white">
          The Forge Concept
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <GlowCard delay={0.1}>
            <h3 className="text-xl font-serif text-teal mb-3">🔨 Assess</h3>
            <p className="text-gray-700 dark:text-gray-300">We analyze your team&apos;s communication gaps using proprietary diagnostics.</p>
          </GlowCard>
          <GlowCard delay={0.2}>
            <h3 className="text-xl font-serif text-teal mb-3">⚡ Forge</h3>
            <p className="text-gray-700 dark:text-gray-300">Custom lesson plans forged in our LessonOS platform, tailored to your industry.</p>
          </GlowCard>
          <GlowCard delay={0.3}>
            <h3 className="text-xl font-serif text-teal mb-3">✨ Transform</h3>
            <p className="text-gray-700 dark:text-gray-300">Measurable improvement in fluency, confidence, and business impact.</p>
          </GlowCard>
        </div>
        
        <section className="py-20">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-navy dark:text-white">
            The IDEA Methodology™
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { letter: 'I', title: 'Interactive', desc: 'Live simulations and role-plays' },
              { letter: 'D', title: 'Discovery', desc: 'Self-directed learning paths' },
              { letter: 'E', title: 'Experiential', desc: 'Real-world business scenarios' },
              { letter: 'A', title: 'Adaptive', desc: 'AI-driven personalization' },
            ].map((item, i) => (
              <GlowCard key={item.letter} delay={i * 0.1} className="text-center">
                <div className="text-4xl font-serif text-gold mb-2">{item.letter}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </GlowCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <ShimmerButton href="/methodology">Explore IDEA Framework</ShimmerButton>
          </div>
        </section>
        
        <LessonOSPreview />
      </section>
    </>
  )
}

export default HomePage
