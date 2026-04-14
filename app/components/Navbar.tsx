'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShimmerButton } from './ShimmerButton'
import { DarkModeToggle } from './DarkModeToggle'

const navLinks = [
  { href: '/methodology', label: 'Methodology' },
  { href: '/platform', label: 'Platform' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-navy/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-serif text-2xl font-bold text-navy dark:text-white">
          Talksmiths
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group text-gray-700 dark:text-gray-300 hover:text-teal transition-colors font-medium"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full" />
            </Link>
          ))}
          <DarkModeToggle />
          <Link href="/contact">
            <ShimmerButton>Book Demo</ShimmerButton>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
