// Talksmiths Static Lesson Library
// Pre-built lessons following the IDEA Methodology™ 7-Step Framework

export interface StaticLesson {
  id: string
  title: string
  subtitle: string
  level: 'A2' | 'B1' | 'B2' | 'C1'
  duration: number
  targetRole: string
  grammarFocus: string
  topic: string
  tags: string[]
  description: string
}

export interface IndustryCategory {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  lessonsCount: number
  lessons: StaticLesson[]
}

export const LIBRARY: IndustryCategory[] = [
  {
    id: 'fintech',
    name: 'Fintech & Banking',
    emoji: '💳',
    color: '#6366f1',
    description: 'Regulatory negotiations, M&A communications, investor relations, and compliance language for financial professionals.',
    lessonsCount: 36,
    lessons: [
      { id: 'ft-01', title: 'Navigating Regulatory Compliance Conversations', subtitle: 'Language for presenting compliance frameworks to stakeholders', level: 'B2', duration: 90, targetRole: 'Compliance Officer', grammarFocus: 'Passive voice for diplomatic distancing', topic: 'Compliance & Regulation', tags: ['Compliance', 'Regulation', 'Stakeholders'], description: 'Master the language of regulatory frameworks. Present audit findings, respond to regulator inquiries, and negotiate compliance timelines with confidence and precision.' },
      { id: 'ft-02', title: 'M&A Due Diligence: The Language of Negotiation', subtitle: 'High-stakes deal negotiation vocabulary and roleplays', level: 'C1', duration: 120, targetRole: 'CFO / Finance Director', grammarFocus: 'Conditionals for negotiation (If we were to..., Should you decide to...)', topic: 'Mergers & Acquisitions', tags: ['M&A', 'Negotiation', 'Due Diligence'], description: 'Communicate with precision in merger discussions. Structure counter-proposals, manage valuation disagreements, and lead due diligence meetings in English.' },
      { id: 'ft-03', title: 'Investor Relations: Presenting Financial Results', subtitle: 'Earnings calls, board presentations, and analyst Q&A', level: 'B2', duration: 90, targetRole: 'CFO / IR Manager', grammarFocus: 'Hedging language (approximately, broadly speaking, there are indications that)', topic: 'Investor Relations', tags: ['Investor Relations', 'Presentations', 'Finance'], description: 'Present quarterly results with authority. Navigate analyst questions, manage negative news diplomatically, and use hedging language like a seasoned executive.' },
      { id: 'ft-04', title: 'KYC & AML: Explaining Regulatory Requirements to Clients', subtitle: 'Client-facing language for sensitive compliance topics', level: 'B1', duration: 60, targetRole: 'Relationship Manager', grammarFocus: 'Modal verbs for obligation and necessity (must, have to, are required to)', topic: 'KYC / AML', tags: ['KYC', 'AML', 'Client Communication'], description: 'Explain KYC and AML requirements clearly and professionally. Use polite, firm language to request documentation without damaging client relationships.' },
      { id: 'ft-05', title: 'Pitching a Fintech Solution to a Traditional Bank', subtitle: 'Sales language for B2B innovation partnerships', level: 'B2', duration: 90, targetRole: 'Business Development Manager', grammarFocus: 'Expanded noun phrases for precision ("a scalable, API-first payment infrastructure")', topic: 'B2B Sales & Pitching', tags: ['Pitching', 'Sales', 'Innovation'], description: 'Master the language of fintech disruption. Structure compelling pitches to conservative decision-makers and handle objections about security, cost, and integration.' },
      { id: 'ft-06', title: 'Managing a Credit Risk Escalation', subtitle: 'Cross-functional communication under pressure', level: 'B2', duration: 75, targetRole: 'Credit Risk Analyst', grammarFocus: 'Discourse markers for structured argumentation', topic: 'Risk Management', tags: ['Risk', 'Crisis Communication', 'Internal Meetings'], description: 'Communicate credit risk clearly under time pressure. Write urgent escalation emails, run cross-departmental crisis calls, and present risk mitigation plans.' },
      { id: 'ft-07', title: 'VC Fundraising: The Pitch Deck Narrative', subtitle: 'Storytelling and persuasion for startup founders seeking capital', level: 'C1', duration: 120, targetRole: 'Startup Founder / CEO', grammarFocus: 'Rhetorical devices: Rule of three, anaphora, contrast', topic: 'Fundraising & Investment', tags: ['Startup', 'Venture Capital', 'Pitching'], description: 'Build a compelling funding narrative. Use the problem-solution-impact structure, deliver market size arguments, and handle tough investor questions with confidence.' },
      { id: 'ft-08', title: 'Payment Processing: Negotiating SaaS Contracts', subtitle: 'Technical and commercial negotiation language for payment APIs', level: 'B2', duration: 90, targetRole: 'Key Account Manager', grammarFocus: 'Question tags for confirmation (The SLA covers downtime, doesn\'t it?)', topic: 'Contract Negotiation', tags: ['SaaS', 'Contracts', 'Payments'], description: 'Negotiate transaction fees, SLAs, and integration timelines with enterprise clients. Use confirmation language to lock agreements and avoid ambiguity.' },
    ],
  },
  {
    id: 'technology',
    name: 'Technology & IT',
    emoji: '💻',
    color: '#0d7a7e',
    description: 'Agile facilitation, technical presentations, stakeholder management, and cross-cultural remote team communication.',
    lessonsCount: 36,
    lessons: [
      { id: 'tech-01', title: 'Running a Sprint Review with Senior Stakeholders', subtitle: 'Agile reporting language for mixed technical/non-technical audiences', level: 'B2', duration: 90, targetRole: 'Scrum Master / Product Owner', grammarFocus: 'Passive voice + nominalisation for formal reporting', topic: 'Agile & Scrum', tags: ['Agile', 'Sprint Review', 'Stakeholders'], description: 'Communicate sprint outcomes to executives who don\'t speak Agile. Translate technical velocity metrics into business value, and field tough questions with confidence.' },
      { id: 'tech-02', title: 'Managing Unrealistic Deadlines: The Negotiation', subtitle: 'How to push back professionally on impossible timelines', level: 'B2', duration: 75, targetRole: 'Engineering Manager / Scrum Master', grammarFocus: 'Conditionals and softened imperatives for professional assertiveness', topic: 'Deadline Management', tags: ['Deadlines', 'Negotiation', 'Project Management'], description: 'Say "no" professionally without burning bridges. Use data-backed language, conditional framing, and collaborative alternatives to negotiate realistic timelines.' },
      { id: 'tech-03', title: 'The Architecture Decision: Presenting a Technical Recommendation', subtitle: 'Making a persuasive case for a technical approach to leadership', level: 'C1', duration: 120, targetRole: 'Tech Lead / Solutions Architect', grammarFocus: 'Hedging and certainty language for technical recommendations', topic: 'Technical Communication', tags: ['Architecture', 'Decision Making', 'Leadership'], description: 'Build the business case for a major technical decision. Use structured argumentation, risk/benefit language, and respond to leadership pushback with evidence.' },
      { id: 'tech-04', title: 'Incident Response: Communicating a System Outage', subtitle: 'Crisis communication for technical incidents', level: 'B1', duration: 60, targetRole: 'DevOps Engineer / SRE', grammarFocus: 'Timeline language and past perfect for incident reports', topic: 'Crisis Communication', tags: ['Incident Response', 'Crisis', 'Internal Comms'], description: 'Communicate an outage clearly, calmly, and professionally. Write a post-mortem that protects your team, satisfies management, and builds trust.' },
      { id: 'tech-05', title: 'Software Demo: Selling the Feature, Not the Code', subtitle: 'Demo language that connects technical features to business outcomes', level: 'B2', duration: 90, targetRole: 'Sales Engineer / Pre-Sales Consultant', grammarFocus: 'Cause-and-effect connectors ("This means that...", "As a result...")', topic: 'Product Demos', tags: ['Demo', 'Sales', 'Product'], description: 'Stop talking about features. Start talking about outcomes. Master the "So what?" technique to connect every technical capability to a client pain point.' },
      { id: 'tech-06', title: 'Cross-Border Team Meeting: Managing Remote Collaboration', subtitle: 'Inclusive facilitation language for distributed global teams', level: 'B1', duration: 60, targetRole: 'Project Manager / Team Lead', grammarFocus: 'Checking understanding and inviting participation', topic: 'Remote Work', tags: ['Remote Teams', 'Facilitation', 'Inclusion'], description: 'Run effective remote meetings with colleagues across time zones. Use inclusive facilitation language, manage silence, and ensure all voices are heard.' },
      { id: 'tech-07', title: 'Cybersecurity Briefing: Explaining Threats to the C-Suite', subtitle: 'Translating technical cyber risks into executive language', level: 'B2', duration: 90, targetRole: 'CISO / Security Manager', grammarFocus: 'Quantifying and qualifying risk language ("a critical vulnerability in...", "exposure that could result in...")', topic: 'Cybersecurity', tags: ['Cybersecurity', 'C-Suite', 'Risk'], description: 'Make the board care about cybersecurity. Translate APTs, zero-days, and threat models into language about reputation, liability, and business continuity.' },
      { id: 'tech-08', title: 'HR Tech Negotiations: Buying an Enterprise Software Platform', subtitle: 'Vendor evaluation and contract negotiation language', level: 'B2', duration: 75, targetRole: 'IT Procurement Manager', grammarFocus: 'Formal conditional structures for negotiation correspondence', topic: 'Procurement & Contracts', tags: ['Procurement', 'Negotiation', 'Enterprise Software'], description: 'Negotiate enterprise software contracts with confidence. Use technical and commercial language to challenge vendor proposals, extract concessions, and protect SLAs.' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Pharma',
    emoji: '🏥',
    color: '#10b981',
    description: 'Clinical trial communications, regulatory submissions, medical device sales, and healthcare leadership conversations.',
    lessonsCount: 36,
    lessons: [
      { id: 'hc-01', title: 'Presenting Clinical Trial Results to Investors', subtitle: 'Translating Phase III data into investor-friendly language', level: 'C1', duration: 120, targetRole: 'Medical Director / CMO', grammarFocus: 'Hedging in scientific communication ("The data suggest...", "These findings indicate...")', topic: 'Clinical Communication', tags: ['Clinical Trials', 'Investors', 'Pharma'], description: 'Present complex clinical data with clarity and conviction. Navigate investor skepticism about efficacy and safety data, and manage questions about competitive pipeline.' },
      { id: 'hc-02', title: 'Regulatory Submission: Communicating with the FDA/EMA', subtitle: 'Formal correspondence language for regulatory bodies', level: 'C1', duration: 90, targetRole: 'Regulatory Affairs Manager', grammarFocus: 'Passive voice and institutional language for formal submissions', topic: 'Regulatory Affairs', tags: ['FDA', 'EMA', 'Regulatory'], description: 'Write and speak with precision in regulatory contexts. Draft formal correspondence to health authorities, respond to information requests, and present at regulatory meetings.' },
      { id: 'hc-03', title: 'Medical Device Sales: The Hospital C-Suite Meeting', subtitle: 'ROI-based selling to hospital procurement committees', level: 'B2', duration: 90, targetRole: 'Medical Device Sales Manager', grammarFocus: 'Comparative structures ("...compared to the current standard of care...")', topic: 'Medical Sales', tags: ['Medical Devices', 'Sales', 'Hospital'], description: 'Sell value to budget-conscious hospital administrators. Use ROI language, clinical outcomes data, and total cost of ownership arguments to win procurement decisions.' },
      { id: 'hc-04', title: 'Managing a Patient Safety Escalation', subtitle: 'Crisis communication language for adverse event reporting', level: 'B2', duration: 75, targetRole: 'Pharmacovigilance Manager', grammarFocus: 'Timeline reconstruction with past perfect and sequential connectors', topic: 'Patient Safety', tags: ['Pharmacovigilance', 'Crisis', 'Safety'], description: 'Navigate the intense language demands of an adverse event escalation. Communicate with regulators, internal stakeholders, and medical teams with accuracy and calm.' },
      { id: 'hc-05', title: 'Healthcare Operations: Leading a Cross-Functional Improvement Project', subtitle: 'Project leadership language for hospital operations', level: 'B2', duration: 90, targetRole: 'Hospital Operations Manager', grammarFocus: 'Discourse markers for structured project communication', topic: 'Operations & Improvement', tags: ['Operations', 'Project Management', 'Healthcare'], description: 'Lead a cross-functional team through a process improvement initiative. Align clinicians, administrators, and IT around shared goals using clear, structured English.' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal & Consulting',
    emoji: '⚖️',
    color: '#c49a1a',
    description: 'Client advisory sessions, contract negotiation, dispute resolution, and high-stakes stakeholder communication.',
    lessonsCount: 36,
    lessons: [
      { id: 'leg-01', title: 'Contract Negotiation: The Indemnity Clause Battle', subtitle: 'Precise language for high-stakes contract discussions', level: 'C1', duration: 120, targetRole: 'Legal Counsel / Contract Manager', grammarFocus: 'Formal conditionals and legal hedge language ("subject to...", "notwithstanding...")', topic: 'Contract Negotiation', tags: ['Contracts', 'Negotiation', 'Legal'], description: 'Hold your position in a complex contract negotiation. Use precise legal-English to challenge unfavorable clauses, propose alternatives, and reach a workable agreement.' },
      { id: 'leg-02', title: 'Client Advisory: Delivering Difficult Legal News', subtitle: 'Managing client expectations with clarity and empathy', level: 'B2', duration: 75, targetRole: 'Associate / Senior Lawyer', grammarFocus: 'Mitigation language and diplomatic framing ("While I appreciate...", "It is important to note that...")', topic: 'Client Communication', tags: ['Client Advisory', 'Difficult Conversations', 'Law'], description: 'Deliver bad news to clients without losing their trust. Use structured, empathetic language to explain unfavorable legal outcomes and present constructive alternatives.' },
      { id: 'leg-03', title: 'The Consulting Proposal: Selling Strategic Advice', subtitle: 'Language of executive-level consulting presentations', level: 'B2', duration: 90, targetRole: 'Management Consultant', grammarFocus: 'Nominalization for authoritative, formal tone', topic: 'Consulting & Proposals', tags: ['Consulting', 'Proposals', 'Strategy'], description: 'Present a strategic recommendation that wins the engagement. Use the Pyramid Principle, precise business vocabulary, and executive-presence language.' },
      { id: 'leg-04', title: 'Dispute Resolution: The Mediation Session', subtitle: 'Facilitation and advocacy language in a formal dispute', level: 'C1', duration: 120, targetRole: 'In-House Counsel / Legal Manager', grammarFocus: 'Indirect reported speech and conditional framing', topic: 'Dispute Resolution', tags: ['Mediation', 'Dispute', 'Negotiation'], description: 'Navigate a complex commercial dispute. Use assertive but diplomatic language to present your client\'s position, challenge the other party\'s claims, and work toward resolution.' },
    ],
  },
  {
    id: 'bpo',
    name: 'BPO & Customer Experience',
    emoji: '📞',
    color: '#f59e0b',
    description: 'Escalation handling, quality coaching, SLA communication, and client relationship management for service delivery professionals.',
    lessonsCount: 36,
    lessons: [
      { id: 'bpo-01', title: 'De-escalating an Angry Enterprise Client', subtitle: 'Language of crisis management in customer service leadership', level: 'B2', duration: 75, targetRole: 'Customer Success Manager / Team Lead', grammarFocus: 'Empathy language + conditional solutions ("I completely understand your frustration. If we were to...")', topic: 'Escalation Handling', tags: ['Escalation', 'Client Management', 'CX'], description: 'Turn an angry client into a loyal one. Use structured de-escalation language, take full ownership, and propose solutions that rebuild confidence and protect the contract.' },
      { id: 'bpo-02', title: 'SLA Review: Presenting Performance to the Client', subtitle: 'Formal reporting language for service delivery reviews', level: 'B2', duration: 90, targetRole: 'Operations Manager / Account Director', grammarFocus: 'Trend language and comparative structures for data presentation', topic: 'SLA Management', tags: ['SLA', 'Performance', 'Reporting'], description: 'Present a mixed SLA report with confidence. Contextualize weak metrics, highlight improvements, and propose corrective actions that demonstrate proactivity.' },
      { id: 'bpo-03', title: 'Quality Coaching: Giving Feedback to an Underperforming Agent', subtitle: 'Coaching language for frontline team development', level: 'B1', duration: 60, targetRole: 'Quality Assurance Manager / Team Leader', grammarFocus: 'Softened imperatives and the feedback sandwich structure', topic: 'Coaching & Feedback', tags: ['Coaching', 'Feedback', 'Performance Management'], description: 'Coach struggling agents without demotivating them. Use the SBI (Situation-Behavior-Impact) model and specific, action-oriented language to drive real improvement.' },
      { id: 'bpo-04', title: 'Winning a BPO Contract Renewal', subtitle: 'Commercial language for high-stakes contract defenses', level: 'B2', duration: 90, targetRole: 'Account Director / Commercial Manager', grammarFocus: 'Persuasive discourse structures: Problem-Solution-Benefit', topic: 'Contract Renewal', tags: ['Contract Renewal', 'Sales', 'Client Retention'], description: 'Defend your contract against a competitive threat. Build a compelling renewal case using ROI data, relationship capital language, and strategic value articulation.' },
      { id: 'bpo-05', title: 'Workforce Planning: Presenting Headcount Requests to Finance', subtitle: 'Language for justifying resource investments to budget holders', level: 'B2', duration: 75, targetRole: 'WFM Manager / Operations Director', grammarFocus: 'Cause-and-effect structures for business case argumentation', topic: 'Workforce & Finance', tags: ['Workforce Planning', 'Finance', 'Business Case'], description: 'Justify headcount investments to skeptical finance teams. Build a data-driven business case using ROI language, cost-per-error analysis, and strategic growth framing.' },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive & Manufacturing',
    emoji: '🏭',
    color: '#64748b',
    description: 'Supply chain negotiations, lean process communication, quality management, and cross-cultural factory leadership.',
    lessonsCount: 36,
    lessons: [
      { id: 'auto-01', title: 'Supply Chain Disruption: Emergency Supplier Negotiation', subtitle: 'High-pressure negotiation language during a supply crisis', level: 'B2', duration: 90, targetRole: 'Supply Chain Manager / Purchasing Director', grammarFocus: 'Urgency language and conditional proposals ("Unless we receive... by Friday, we will need to...")', topic: 'Supply Chain', tags: ['Supply Chain', 'Negotiation', 'Crisis'], description: 'Navigate a critical parts shortage. Use urgent but professional language to pressure alternative suppliers, negotiate emergency terms, and protect your production line.' },
      { id: 'auto-02', title: 'Lean Manufacturing: Presenting a Process Improvement to Leadership', subtitle: 'Language for Kaizen and continuous improvement communications', level: 'B2', duration: 75, targetRole: 'Lean / Operations Engineer', grammarFocus: 'Cause-and-effect and sequential connectors for process narration', topic: 'Lean & Process', tags: ['Lean', 'Kaizen', 'Process Improvement'], description: 'Present a Kaizen breakthrough to senior management. Quantify waste reduction, set up before/after comparisons, and build a compelling ROI case for rollout.' },
      { id: 'auto-03', title: 'Quality Audit: Responding to an ISO Non-Conformance', subtitle: 'Formal language for quality management communications', level: 'B2', duration: 90, targetRole: 'Quality Manager', grammarFocus: 'Passive voice and institutional formality for formal reports', topic: 'Quality Management', tags: ['ISO', 'Quality', 'Audit'], description: 'Respond to an ISO auditor\'s non-conformance finding. Write a formal corrective action plan, present root cause analysis (5 Whys), and close the audit loop with confidence.' },
      { id: 'auto-04', title: 'Managing a Joint Venture Partner Meeting', subtitle: 'Cross-cultural communication with international JV partners', level: 'C1', duration: 120, targetRole: 'General Manager / Plant Director', grammarFocus: 'Formal suggesting and tentative language for cross-cultural sensitivity', topic: 'Joint Ventures', tags: ['Joint Venture', 'Cross-Cultural', 'Leadership'], description: 'Lead a tense JV partner meeting with confidence. Manage cultural differences in communication style, negotiate shared KPIs, and build consensus on disputed production targets.' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy & Sustainability',
    emoji: '⚡',
    color: '#22c55e',
    description: 'ESG reporting, renewable energy project communication, government relations, and investor-facing sustainability language.',
    lessonsCount: 36,
    lessons: [
      { id: 'en-01', title: 'ESG Reporting: Presenting Sustainability Commitments to Investors', subtitle: 'Language for ESG disclosure and investor relations', level: 'C1', duration: 120, targetRole: 'Sustainability Director / ESG Manager', grammarFocus: 'Hedging and commitment language in formal reporting', topic: 'ESG & Sustainability', tags: ['ESG', 'Sustainability', 'Investors'], description: 'Present your ESG roadmap to investors with authority. Navigate questions about greenwashing risks, articulate scope 3 emissions strategy, and communicate long-term decarbonisation plans.' },
      { id: 'en-02', title: 'Renewable Energy Project: Government Stakeholder Meeting', subtitle: 'Formal communication language for public sector engagement', level: 'B2', duration: 90, targetRole: 'Project Director / Government Relations Manager', grammarFocus: 'Formal institutional language and diplomatic suggestion structures', topic: 'Government Relations', tags: ['Renewable Energy', 'Government', 'Stakeholders'], description: 'Navigate a sensitive government stakeholder meeting about a new solar or wind project. Address community concerns, negotiate permits, and build political will for your project.' },
      { id: 'en-03', title: 'Power Purchase Agreement: Commercial Negotiation', subtitle: 'High-stakes contract language for energy deals', level: 'C1', duration: 120, targetRole: 'Commercial Director / Energy Trader', grammarFocus: 'Legal conditionals and formal contract language', topic: 'Energy Contracts', tags: ['PPA', 'Contracts', 'Energy'], description: 'Negotiate a long-term Power Purchase Agreement with a corporate buyer. Discuss take-or-pay terms, curtailment risk, indexation clauses, and force majeure in precise English.' },
    ],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    emoji: '🏨',
    color: '#f43f5e',
    description: 'Guest experience communication, luxury brand positioning, revenue management, and high-touch client relationship language.',
    lessonsCount: 36,
    lessons: [
      { id: 'hosp-01', title: 'Managing a VIP Guest Complaint at a Luxury Property', subtitle: 'Service recovery language for high-end hospitality', level: 'B2', duration: 75, targetRole: 'Front Office Manager / Guest Relations Manager', grammarFocus: 'Empathy and ownership language with formal register', topic: 'Service Recovery', tags: ['Guest Experience', 'Complaints', 'Luxury'], description: 'Turn a luxury complaint into a loyalty moment. Use formal, warm, and precise English to acknowledge failure, demonstrate ownership, and exceed expectations in resolution.' },
      { id: 'hosp-02', title: 'Corporate Account Sales: Winning the RFP', subtitle: 'Language for presenting a hotel as a preferred corporate partner', level: 'B2', duration: 90, targetRole: 'Sales Manager / MICE Director', grammarFocus: 'Persuasive structures and value proposition language', topic: 'B2B Hotel Sales', tags: ['MICE', 'Corporate Sales', 'RFP'], description: 'Win the corporate account proposal. Use value-based selling language, differentiate on experience rather than price, and build an emotionally compelling case for your property.' },
      { id: 'hosp-03', title: 'Revenue Management: Presenting Pricing Strategy to Ownership', subtitle: 'Data-driven communication for hotel revenue leaders', level: 'B2', duration: 90, targetRole: 'Revenue Manager / Commercial Director', grammarFocus: 'Trend language and comparative structures for revenue data', topic: 'Revenue Management', tags: ['Revenue Management', 'Pricing', 'Ownership'], description: 'Justify your dynamic pricing strategy to demanding hotel owners. Present RevPAR, ADR, and market penetration index data with conviction, and defend rate parity decisions.' },
    ],
  },
]

export function getIndustryById(id: string): IndustryCategory | undefined {
  return LIBRARY.find((cat) => cat.id === id)
}

export function getLessonById(industryId: string, lessonId: string): StaticLesson | undefined {
  const industry = getIndustryById(industryId)
  return industry?.lessons.find((l) => l.id === lessonId)
}

export const LEVEL_COLORS: Record<string, string> = {
  A2: '#64748b',
  B1: '#10b981',
  B2: '#6366f1',
  C1: '#f59e0b',
}

export const LEVEL_LABELS: Record<string, string> = {
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
}
