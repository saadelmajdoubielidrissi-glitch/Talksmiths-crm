export const generateMetadata = (page: string) => {
  const base = {
    title: {
      default: 'Talksmiths - Premium B2B Language Training & Business English Coaching',
      template: '%s | Talksmiths'
    },
    description: 'Forge communicators. Transform your enterprise with the IDEA Methodology™. Premium Business English training for Moroccan B2B leaders.',
    keywords: ['Business English Training', 'Corporate Language Coaching', 'IDEA Methodology', 'Moroccan B2B English'],
    authors: [{ name: 'Talksmiths' }],
    creator: 'Talksmiths',
    publisher: 'Talksmiths',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
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
  }

  const pages = {
    methodology: {
      title: 'IDEA Methodology',
      description: 'Discover the Interactive, Discovery, Experiential, Adaptive framework that forges elite communicators.',
    },
    platform: {
      title: 'LessonOS Platform',
      description: 'AI-powered lesson generation engine with Teach Mode for distraction-free instruction.',
    },
    services: {
      title: 'Premium Services',
      description: '1-on-1 Coaching, Group Training, and Intensive Workshops for enterprise clients.',
    },
    about: {
      title: 'About Talksmiths',
      description: 'Forging communicators since 2020. Our mission to transform B2B language training.',
    },
    contact: {
      title: 'Book a Demo',
      description: 'Schedule your personalized demo and discover how Talksmiths can transform your team.',
    },
  }

  return {
    ...base,
    ...(pages[page as keyof typeof pages] || {}),
  }
}
