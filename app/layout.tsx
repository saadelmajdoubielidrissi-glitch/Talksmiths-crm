import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import { DarkModeProvider } from './context/DarkModeContext'
import { LayoutWrapper } from './components/LayoutWrapper'
import './styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: {
    default: 'Talksmiths - Premium B2B Language Training & Business English Coaching',
    template: '%s | Talksmiths',
  },
  description: 'Forge communicators. Transform your enterprise with the IDEA Methodology™. Premium Business English training for Moroccan B2B leaders.',
  keywords: ['Business English Training', 'Corporate Language Coaching', 'IDEA Methodology', 'Moroccan B2B English'],
  openGraph: {
    type: 'website',
    locale: 'en_MA',
    url: 'https://talksmiths.ma',
    title: 'Talksmiths - Premium B2B Language Training',
    description: 'Forge communicators. Transform your enterprise with the IDEA Methodology™.',
    siteName: 'Talksmiths',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talksmiths - Premium B2B Language Training',
    description: 'Forge communicators. Transform your enterprise with the IDEA Methodology™.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceSerif.variable}`}>
        <DarkModeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </DarkModeProvider>
      </body>
    </html>
  )
}
