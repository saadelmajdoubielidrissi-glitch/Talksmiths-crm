'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    role: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', company: '', email: '', role: '', message: '' })
      }
    } catch {
      alert('Error sending request. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="glass-card p-8 rounded-xl text-center">
        <p className="text-xl text-teal font-semibold">Demo request sent! We&apos;ll contact you within 24 hours.</p>
      </div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="glass-card p-8 rounded-xl"
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 dark:bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-teal transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Company *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 dark:bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-teal transition-colors"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 dark:bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-teal transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Your Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 dark:bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-teal transition-colors"
            >
              <option value="">Select your role</option>
              <option value="hr">HR/L&amp;D Manager</option>
              <option value="ceo">CEO/Executive</option>
              <option value="team-lead">Team Leader</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2">Tell us about your needs</label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 dark:bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-teal transition-colors"
            placeholder="What communication challenges is your team facing?"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-4 bg-gold text-navy font-bold rounded-lg hover:bg-gold/90 transition-colors"
        >
          Book My Demo
        </button>
      </div>
    </motion.form>
  )
}
