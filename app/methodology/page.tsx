import { Metadata } from 'next'
import { GlowCard } from '../components/GlowCard'
import { ShimmerButton } from '../components/ShimmerButton'

export const metadata: Metadata = {
  title: 'IDEA Methodology',
}

const MethodologyPage = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl md:text-6xl font-serif text-center mb-6 text-navy dark:text-white">
        The IDEA Methodology™
      </h1>
      
      <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
        A scientifically-backed framework forged through years of enterprise training experience.
      </p>
      
      <div className="space-y-12 max-w-5xl mx-auto">
        {[
          {
            icon: '💬',
            title: 'Interactive',
            description: 'Every lesson is a dialogue, not a monologue. Participants engage in live simulations, peer reviews, and real-time feedback loops.',
            benefits: ['Live Role-Plays', 'Peer-to-Peer Coaching', 'Instant Feedback'],
          },
          {
            icon: '🔍',
            title: 'Discovery',
            description: 'Learners uncover knowledge through guided exploration. We facilitate self-directed learning that builds critical thinking.',
            benefits: ['Self-Paced Modules', 'Curated Resources', 'Learning Pathways'],
          },
          {
            icon: '🎯',
            title: 'Experiential',
            description: 'Real business scenarios. Actual pitch practice. Authentic negotiation simulations. Learning by doing.',
            benefits: ['Real-World Cases', 'Industry-Specific Content', 'Hands-On Practice'],
          },
          {
            icon: '🧠',
            title: 'Adaptive',
            description: 'Our AI engine adjusts difficulty, pace, and content based on individual performance and learning patterns.',
            benefits: ['AI Personalization', 'Progress Tracking', 'Dynamic Content'],
          },
        ].map((item, i) => (
          <GlowCard key={item.title} delay={i * 0.1} className="p-8">
            <div className="flex items-start gap-6">
              <div className="text-4xl">{item.icon}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-serif text-teal mb-4">{item.title}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-3">
                  {item.benefits.map((benefit) => (
                    <span key={benefit} className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
      
      <div className="text-center mt-16">
        <ShimmerButton href="/contact">Experience IDEA in Action</ShimmerButton>
      </div>
    </div>
  )
}

export default MethodologyPage
