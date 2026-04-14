'use client';
// Talksmiths CRM — Data Store (localStorage-backed, Supabase-ready)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lead, Contact, Activity, Partner, Commission, CRMUser, PipelineStage, OutreachTemplate } from './types';
import { DEMO_LEADS, DEMO_CONTACTS, DEMO_ACTIVITIES, DEMO_USERS, DEMO_PARTNERS } from './mockData';

interface CRMState {
  leads: Lead[];
  contacts: Contact[];
  activities: Activity[];
  partners: Partner[];
  commissions: Commission[];
  templates: OutreachTemplate[];
  currentUser: CRMUser | null;
  isAuthenticated: boolean;
}

interface CRMActions {
  // Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  // Leads
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => Lead;
  importLeads: (leads: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score'>[]) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLead: (id: string, stage: PipelineStage) => void;
  bulkDeleteLeads: (ids: string[]) => void;
  bulkMoveLeads: (ids: string[], stage: PipelineStage) => void;
  bulkAssignLeads: (ids: string[], partnerId: string) => void;
  // Contacts
  addContact: (contact: Omit<Contact, 'id'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactsForLead: (leadId: string) => Contact[];
  // Activities
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'userId' | 'userName'>) => Activity;
  getActivitiesForLead: (leadId: string) => Activity[];
  // Partners
  addPartner: (partner: Omit<Partner, 'id' | 'joinedAt'>) => Partner;
  updatePartner: (id: string, updates: Partial<Partner>) => void;
  // Templates
  addTemplate: (template: Omit<OutreachTemplate, 'id' | 'createdAt'>) => OutreachTemplate;
  updateTemplate: (id: string, updates: Partial<OutreachTemplate>) => void;
  deleteTemplate: (id: string) => void;
  // Stats
  getLeadsByStage: () => Record<PipelineStage, Lead[]>;
  getPipelineValue: () => number;
  getConversionRate: () => number;
  getFollowupsDueToday: () => Lead[];
  getRecentActivities: (limit?: number) => Activity[];
  getSectorBreakdown: () => { sector: string; count: number; value: number }[];
}

type CRMContextType = CRMState & CRMActions;

const CRMContext = createContext<CRMContextType | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function calculateScore(lead: Partial<Lead>): number {
  let score = 0;
  const sector = (lead.sector || '').toLowerCase();
  const english = (lead.englishRequirement || '').toLowerCase();
  const international = (lead.internationalPresence || '').toLowerCase();

  // Sector scoring (max 30)
  const highPriority = ['bpo', 'cx', 'it services', 'tech', 'software', 'cloud', 'fintech', 'saas', 'ai', 'consulting', 'cybersecurity'];
  const midPriority = ['telecom', 'automotive', 'aerospace', 'pharma', 'logistics', 'e-commerce'];
  if (highPriority.some(k => sector.includes(k))) score += 30;
  else if (midPriority.some(k => sector.includes(k))) score += 20;
  else score += 10;

  // English requirement (max 40)
  if (english.includes('very high') || english.includes('english-only')) score += 40;
  else if (english.includes('high')) score += 30;
  else if (english.includes('medium')) score += 20;
  else score += 10;

  // International presence (max 30)
  if (['global', 'us', 'uk', 'worldwide'].some(k => international.includes(k))) score += 30;
  else if (['europe', 'eu', 'africa', 'middle east'].some(k => international.includes(k))) score += 20;
  else score += 10;

  return score;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(`crm_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`crm_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [currentUser, setCurrentUser] = useState<CRMUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedLeads = loadFromStorage('leads', null);
    const storedContacts = loadFromStorage('contacts', null);
    const storedActivities = loadFromStorage('activities', null);
    const storedPartners = loadFromStorage('partners', null);
    const storedCommissions = loadFromStorage('commissions', []);
    const storedTemplates = loadFromStorage<OutreachTemplate[]>('templates', [
      {
        id: 'template-1',
        name: 'French HR Outbound',
        category: 'Outbound',
        language: 'fr',
        subject: 'Partenariat Formation: {{CompanyName}} & Talksmiths',
        content: 'Bonjour {{ContactName}},\n\nDans un contexte d\'expansion pour {{CompanyName}} à {{City}}, nous observons un besoin croissant en compétences linguistiques.\n\nRavi d\'en discuter.',
        createdAt: new Date().toISOString()
      }
    ]);
    const storedAuth = loadFromStorage<{ user: CRMUser | null; authed: boolean }>('auth', { user: null, authed: false });

    // Use demo data if nothing stored yet
    setLeads(storedLeads || DEMO_LEADS);
    setContacts(storedContacts || DEMO_CONTACTS);
    setActivities(storedActivities || DEMO_ACTIVITIES);
    setPartners(storedPartners || DEMO_PARTNERS);
    setCommissions(storedCommissions);
    setTemplates(storedTemplates);
    setCurrentUser(storedAuth.user);
    setIsAuthenticated(storedAuth.authed);
    setInitialized(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!initialized) return;
    saveToStorage('leads', leads);
  }, [leads, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveToStorage('contacts', contacts);
  }, [contacts, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveToStorage('activities', activities);
  }, [activities, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveToStorage('partners', partners);
  }, [partners, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveToStorage('commissions', commissions);
  }, [commissions, initialized]);

  useEffect(() => {
    if (!initialized) return;
    saveToStorage('templates', templates);
  }, [templates, initialized]);

  // Auth
  const login = useCallback((email: string, password: string): boolean => {
    // Simple auth — replace with Supabase later
    if (email === 'admin@talksmiths.ma' && password === 'admin123') {
      const user = DEMO_USERS[0];
      setCurrentUser(user);
      setIsAuthenticated(true);
      saveToStorage('auth', { user, authed: true });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    saveToStorage('auth', { user: null, authed: false });
  }, []);

  // Leads
  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score'>): Lead => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${generateId()}`,
      score: calculateScore(leadData),
      createdAt: now,
      updatedAt: now,
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  }, []);

  const importLeads = useCallback((leadsData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'score'>[]) => {
    const now = new Date().toISOString();
    const newLeads = leadsData.map(data => ({
      ...data,
      id: `lead-${generateId()}`,
      score: calculateScore(data),
      createdAt: now,
      updatedAt: now,
    }));
    setLeads(prev => [...newLeads, ...prev]);
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l =>
      l.id === id ? { ...l, ...updates, score: calculateScore({ ...l, ...updates }), updatedAt: new Date().toISOString() } : l
    ));
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setContacts(prev => prev.filter(c => c.leadId !== id));
    setActivities(prev => prev.filter(a => a.leadId !== id));
  }, []);

  const moveLead = useCallback((id: string, stage: PipelineStage) => {
    setLeads(prev => prev.map(l =>
      l.id === id ? { ...l, stage, updatedAt: new Date().toISOString() } : l
    ));
  }, []);

  const bulkDeleteLeads = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setLeads(prev => prev.filter(l => !idSet.has(l.id)));
    setContacts(prev => prev.filter(c => !idSet.has(c.leadId)));
    setActivities(prev => prev.filter(a => !idSet.has(a.leadId)));
  }, []);

  const bulkMoveLeads = useCallback((ids: string[], stage: PipelineStage) => {
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    setLeads(prev => prev.map(l => idSet.has(l.id) ? { ...l, stage, updatedAt: now } : l));
  }, []);

  const bulkAssignLeads = useCallback((ids: string[], assignedTo: string) => {
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    setLeads(prev => prev.map(l => idSet.has(l.id) ? { ...l, assignedTo, updatedAt: now } : l));
  }, []);

  // Contacts
  const addContact = useCallback((data: Omit<Contact, 'id'>): Contact => {
    const newContact: Contact = { ...data, id: `contact-${generateId()}` };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  const getContactsForLead = useCallback((leadId: string) => {
    return contacts.filter(c => c.leadId === leadId);
  }, [contacts]);

  // Activities
  const addActivity = useCallback((data: Omit<Activity, 'id' | 'createdAt' | 'userId' | 'userName'>): Activity => {
    const newActivity: Activity = {
      ...data,
      id: `act-${generateId()}`,
      userId: currentUser?.id || 'user-1',
      userName: currentUser?.name || 'Saad',
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
    // Update lead's updatedAt
    setLeads(prev => prev.map(l =>
      l.id === data.leadId ? { ...l, updatedAt: new Date().toISOString() } : l
    ));
    return newActivity;
  }, [currentUser]);

  const getActivitiesForLead = useCallback((leadId: string) => {
    return activities
      .filter(a => a.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activities]);

  // Partners
  const addPartner = useCallback((data: Omit<Partner, 'id' | 'joinedAt'>): Partner => {
    const partner: Partner = {
      ...data,
      id: `partner-${generateId()}`,
      joinedAt: new Date().toISOString(),
    };
    setPartners(prev => [...prev, partner]);
    return partner;
  }, []);

  const updatePartner = useCallback((id: string, updates: Partial<Partner>) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  // Templates
  const addTemplate = useCallback((data: Omit<OutreachTemplate, 'id' | 'createdAt'>): OutreachTemplate => {
    const template: OutreachTemplate = {
      ...data,
      id: `template-${generateId()}`,
      createdAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, template]);
    return template;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<OutreachTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  // Stats
  const getLeadsByStage = useCallback((): Record<PipelineStage, Lead[]> => {
    const grouped: Record<string, Lead[]> = {};
    leads.forEach(lead => {
      if (!grouped[lead.stage]) grouped[lead.stage] = [];
      grouped[lead.stage].push(lead);
    });
    return grouped as Record<PipelineStage, Lead[]>;
  }, [leads]);

  const getPipelineValue = useCallback((): number => {
    return leads
      .filter(l => l.stage !== 'closed_lost')
      .reduce((sum, l) => sum + l.dealValue, 0);
  }, [leads]);

  const getConversionRate = useCallback((): number => {
    const closed = leads.filter(l => l.stage === 'closed_won').length;
    const total = leads.filter(l => l.stage === 'closed_won' || l.stage === 'closed_lost').length;
    return total > 0 ? Math.round((closed / total) * 100) : 0;
  }, [leads]);

  const getFollowupsDueToday = useCallback((): Lead[] => {
    const today = new Date().toISOString().split('T')[0];
    return leads.filter(l => l.nextFollowup && l.nextFollowup <= today && l.stage !== 'closed_won' && l.stage !== 'closed_lost');
  }, [leads]);

  const getRecentActivities = useCallback((limit = 15): Activity[] => {
    return [...activities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [activities]);

  const getSectorBreakdown = useCallback(() => {
    const map: Record<string, { count: number; value: number }> = {};
    leads.forEach(l => {
      const sector = l.sector.split('/')[0].trim();
      if (!map[sector]) map[sector] = { count: 0, value: 0 };
      map[sector].count++;
      map[sector].value += l.dealValue;
    });
    return Object.entries(map)
      .map(([sector, data]) => ({ sector, ...data }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const contextValue: CRMContextType = {
    leads, contacts, activities, partners, commissions, templates, currentUser, isAuthenticated,
    login, logout,
    addLead, importLeads, updateLead, deleteLead, moveLead,
    bulkDeleteLeads, bulkMoveLeads, bulkAssignLeads,
    addContact, updateContact, deleteContact, getContactsForLead,
    addActivity, getActivitiesForLead,
    addPartner, updatePartner,
    addTemplate, updateTemplate, deleteTemplate,
    getLeadsByStage, getPipelineValue, getConversionRate,
    getFollowupsDueToday, getRecentActivities, getSectorBreakdown,
  };

  return <CRMContext.Provider value={contextValue}>{children}</CRMContext.Provider>;
}

export function useCRM(): CRMContextType {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within a CRMProvider');
  return ctx;
}
