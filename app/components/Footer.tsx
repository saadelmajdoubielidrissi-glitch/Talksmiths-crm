'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export const Footer = () => {
  return (
    <footer className="bg-navy text-white py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-serif text-xl mb-4">Talksmiths</h4>
            <p className="text-sm text-gray-400">Forging communicators. Building enterprise excellence.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Quick Links</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/methodology" className="hover:text-gold transition-colors">Methodology</Link></li>
              <li><Link href="/platform" className="hover:text-gold transition-colors">Platform</Link></li>
              <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Enterprise</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-gold transition-colors">Book Demo</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Contact</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Casablanca, Morocco</li>
              <li>contact@talksmiths.ma</li>
              <li>+212 5 22 22 22 22</li>
            </ul>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-white/10 pt-6 text-center text-gray-400 text-sm"
        >
          <p>© 2024 Talksmiths. All rights reserved. | Forged with precision.</p>
        </motion.div>
      </div>
    </footer>
  )
}
