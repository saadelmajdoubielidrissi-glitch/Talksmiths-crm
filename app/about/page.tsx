import { Metadata } from 'next'
import { GlowCard } from '../components/GlowCard'
import { ShimmerButton } from '../components/ShimmerButton'

export const metadata: Metadata = {
  title: 'About Talksmiths',
}

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl md:text-6xl font-serif text-center mb-6 text-navy dark:text-white">
        Forging Communicators Since 2020
      </h1>
      
      <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
        Born in Casablanca, built for global enterprise. Talksmiths was founded on a simple belief: every business leader deserves to communicate with precision, persuasion, and power.
      </p>
      
      <div className="max-w-4xl mx-auto space-y-12">
        <GlowCard delay={0.1}>
          <h2 className="text-3xl font-serif text-teal mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            To forge the next generation of Moroccan business leaders by transforming their communication capabilities. We don&apos;t teach English—we craft communicators who can negotiate, persuade, and lead in any boardroom worldwide.
          </p>
        </GlowCard>
        
        <GlowCard delay={0.2}>
          <h2 className="text-3xl font-serif text-teal mb-4">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gold mb-2">Excellence</h3>
              <p className="text-gray-700 dark:text-gray-300">Premium quality in every interaction, from curriculum design to client support.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gold mb-2">Precision</h3>
              <p className="text-gray-700 dark:text-gray-300">Data-driven methodology. Measurable outcomes. No guesswork.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gold mb-2">Transformation</h3>
              <p className="text-gray-700 dark:text-gray-300">We don&apos;t just improve skills—we change careers and companies.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gold mb-2">Confidentiality</h3>
              <p className="text-gray-700 dark:text-gray-300">Enterprise-grade privacy. Your team&apos;s development stays private.</p>
            </div>
          </div>
        </GlowCard>
        
        <GlowCard delay={0.3}>
          <h2 className="text-3xl font-serif text-teal mb-4">Our Team</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Led by former corporate executives and linguistics PhDs, our team combines academic rigor with boardroom experience. Every coach has 10+ years in enterprise training and holds advanced certifications in TESOL, NLP, or organizational psychology.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-navy/5 dark:bg-white/5 rounded-lg">
              <div className="w-20 h-20 mx-auto mb-3 bg-teal/20 rounded-full flex items-center justify-center text-2xl">👨‍🏫</div>
              <h4 className="font-semibold">Dr. Youssef Amrani</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chief Learning Officer</p>
            </div>
            <div className="text-center p-4 bg-navy/5 dark:bg-white/5 rounded-lg">
              <div className="w-20 h-20 mx-auto mb-3 bg-teal/20 rounded-full flex items-center justify-center text-2xl">👩‍💼</div>
              <h4 className="font-semibold">Leila Benbrahim</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Head of Enterprise</p>
            </div>
            <div className="text-center p-4 bg-navy/5 dark:bg-white/5 rounded-lg">
              <div className="w-20 h-20 mx-auto mb-3 bg-teal/20 rounded-full flex items-center justify-center text-2xl">👨‍💻</div>
              <h4 className="font-semibold">Karim El Mansouri</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Platform Architect</p>
            </div>
          </div>
        </GlowCard>
      </div>
      
      <div className="text-center mt-16">
        <ShimmerButton href="/contact">Partner With Us</ShimmerButton>
      </div>
    </div>
  )
}

export default AboutPage
