import { Metadata } from 'next'
import { GlowCard } from '../components/GlowCard'
import { ShimmerButton } from '../components/ShimmerButton'

export const metadata: Metadata = {
  title: 'Premium Services',
}

const services = [
  {
    title: '1-on-1 Executive Coaching',
    description: 'Personalized coaching for C-suite and senior leaders. Discreet, intensive, and results-driven.',
    features: ['Weekly 90-min sessions', 'Custom curriculum', 'Progress tracking', 'Flexible scheduling'],
    target: 'For: CEOs, Directors, Senior Managers',
  },
  {
    title: 'Group Training Programs',
    description: 'Small group sessions (4-8 participants) for teams. Collaborative learning with peer feedback.',
    features: ['Cohort-based learning', 'Team dynamics integration', 'Role-play exercises', 'Progress analytics'],
    target: 'For: Departments, Project Teams',
  },
  {
    title: 'Intensive Workshops',
    description: 'Immersive 2-3 day bootcamps. Rapid skill acquisition for high-potential talent.',
    features: ['8-hour intensive days', 'Hands-on practice', 'Real business cases', 'Action plans'],
    target: 'For: High-Potentials, Emerging Leaders',
  },
]

const ServicesPage = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl md:text-6xl font-serif text-center mb-6 text-navy dark:text-white">
        Premium Services
      </h1>
      
      <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
        Tailored solutions for enterprise communication excellence.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, i) => (
          <GlowCard key={service.title} delay={i * 0.1} className="flex flex-col h-full">
            <h3 className="text-2xl font-serif text-teal mb-4">{service.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 flex-1">{service.description}</p>
            <div className="mb-6">
              <p className="text-sm text-gold font-semibold mb-3">{service.target}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-teal">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <ShimmerButton className="w-full">Learn More</ShimmerButton>
          </GlowCard>
        ))}
      </div>
      
      <div className="text-center mt-16 glass-card max-w-2xl mx-auto p-8 rounded-xl">
        <h3 className="text-2xl font-serif text-teal mb-4">Enterprise Solutions</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Custom programs for organizations with 100+ employees. Dedicated account management, bespoke curriculum, and advanced analytics.
        </p>
        <ShimmerButton href="/contact">Contact Enterprise Sales</ShimmerButton>
      </div>
    </div>
  )
}

export default ServicesPage
