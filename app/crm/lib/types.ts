// Talksmiths CRM — Type Definitions

export type PipelineStage =
  | 'new_lead'
  | 'contacted'
  | 'discovery_call'
  | 'demo_meeting'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'linkedin';

export type UserRole = 'admin' | 'partner';

export type CommissionStatus = 'pending' | 'approved' | 'paid';

export interface Lead {
  id: string;
  companyName: string;
  sector: string;
  city: string;
  fundingStage: string;
  englishRequirement: string;
  internationalPresence: string;
  score: number;
  stage: PipelineStage;
  dealValue: number;
  assignedTo: string;
  source: string;
  tags: string[];
  nextFollowup: string | null;
  position?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  leadId: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  isPrimary: boolean;
  isChampion: boolean;
}

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  type: ActivityType;
  content: string;
  createdAt: string;
}

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}

export interface Partner {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
  territories: string[];
  sectors: string[];
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Commission {
  id: string;
  leadId: string;
  partnerId: string;
  dealValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  paidDate: string | null;
  createdAt: string;
}

export interface PipelineStageConfig {
  id: PipelineStage;
  name: string;
  color: string;
  order: number;
  probability: number;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  category: string;
  language: 'en' | 'fr';
  subject: string;
  content: string;
  createdAt: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 'new_lead', name: 'New Lead', color: '#6366f1', order: 0, probability: 5 },
  { id: 'contacted', name: 'Contacted', color: '#8b5cf6', order: 1, probability: 10 },
  { id: 'discovery_call', name: 'Discovery Call', color: '#3b82f6', order: 2, probability: 25 },
  { id: 'demo_meeting', name: 'Demo / Meeting', color: '#06b6d4', order: 3, probability: 40 },
  { id: 'proposal_sent', name: 'Proposal Sent', color: '#f59e0b', order: 4, probability: 60 },
  { id: 'negotiation', name: 'Negotiation', color: '#f97316', order: 5, probability: 80 },
  { id: 'closed_won', name: 'Closed Won', color: '#10b981', order: 6, probability: 100 },
  { id: 'closed_lost', name: 'Lost', color: '#ef4444', order: 7, probability: 0 },
];

export const ACTIVITY_TYPE_CONFIG: Record<ActivityType, { label: string; icon: string; color: string }> = {
  call: { label: 'Call', icon: 'Phone', color: '#3b82f6' },
  email: { label: 'Email', icon: 'Mail', color: '#8b5cf6' },
  meeting: { label: 'Meeting', icon: 'Users', color: '#06b6d4' },
  note: { label: 'Note', icon: 'StickyNote', color: '#f59e0b' },
  linkedin: { label: 'LinkedIn', icon: 'Linkedin', color: '#0077b5' },
};

export function getStageName(stage: PipelineStage): string {
  return PIPELINE_STAGES.find(s => s.id === stage)?.name || stage;
}

export function getStageColor(stage: PipelineStage): string {
  return PIPELINE_STAGES.find(s => s.id === stage)?.color || '#6366f1';
}
