'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedHeroProps {
  title: string
  subtitle: string
  cta?: ReactNode
}

export const AnimatedHero = ({ title, subtitle, cta }: AnimatedHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy/95 to-navy">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 sparkle" />
        <div className="absolute top-20 right-20 sparkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-20 sparkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 right-10 sparkle" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-6 text-center relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
          {title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="inline-block mr-4"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
        
        {cta && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            {cta}
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
