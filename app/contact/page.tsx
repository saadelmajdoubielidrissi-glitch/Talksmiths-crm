import { Metadata } from 'next'
import { GlowCard } from '../components/GlowCard'
import { ContactForm } from './components/ContactForm'

export const metadata: Metadata = {
  title: 'Book a Demo',
}

const ContactPage = () => {
  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <h1 className="text-5xl md:text-6xl font-serif text-center mb-6 text-navy dark:text-white">
        Book Your Demo
      </h1>
      
      <p className="text-xl text-center mb-16 text-gray-700 dark:text-gray-300">
        Experience the Talksmiths difference. See our methodology and platform in action.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <GlowCard delay={0.1}>
          <h3 className="text-xl font-serif text-teal mb-4">📍 Visit Our Forge</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">Casablanca Finance City</p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">Tour Anfa, 20100 Casablanca</p>
          <p className="text-gray-700 dark:text-gray-300">Morocco</p>
        </GlowCard>
        
        <GlowCard delay={0.2}>
          <h3 className="text-xl font-serif text-teal mb-4">📞 Get In Touch</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">+212 5 22 22 22 22</p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">contact@talksmiths.ma</p>
          <p className="text-gray-700 dark:text-gray-300">Response within 24 hours</p>
        </GlowCard>
      </div>
      
      <ContactForm />
    </div>
  )
}

export default ContactPage
