'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ShimmerButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  href?: string
}

export const ShimmerButton = ({ children, onClick, className = '', href }: ShimmerButtonProps) => {
  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden bg-gold text-navy font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )

  if (href) {
    return <a href={href}>{buttonContent}</a>
  }

  return buttonContent
}
