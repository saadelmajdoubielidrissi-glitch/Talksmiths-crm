'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const GlowCard = ({ children, className = '', delay = 0 }: GlowCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`relative glass-card rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-gold/5 rounded-xl pointer-events-none" />
      {children}
    </motion.div>
  )
}
