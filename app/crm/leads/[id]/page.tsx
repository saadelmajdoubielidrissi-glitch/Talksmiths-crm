'use client';
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, Users, StickyNote, MapPin,
  Building2, Globe, BookOpen, Star, Edit2, Trash2, Plus, X,
  Calendar, DollarSign, Tag, ChevronDown, UserPlus, Save, ExternalLink, MessageSquare,
} from 'lucide-react';
import { useCRM } from '../../lib/store';
import { PipelineStage, PIPELINE_STAGES, getStageName, getStageColor, ActivityType, ACTIVITY_TYPE_CONFIG } from '../../lib/types';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  call: Phone, email: Mail, meeting: Users, note: StickyNote, linkedin: MessageSquare,
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    leads, updateLead, deleteLead, moveLead,
    getContactsForLead, addContact, updateContact, deleteContact,
    getActivitiesForLead, addActivity, templates
  } = useCRM();

  const lead = leads.find(l => l.id === id);
  const contacts = getContactsForLead(id);
  const activities = getActivitiesForLead(id);

  const [activityType, setActivityType] = useState<ActivityType>('note');
  const [activityContent, setActivityContent] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', title: '', phone: '', email: '', linkedinUrl: '' });

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 mb-4">Lead not found</p>
        <Link href="/crm/leads" className="crm-btn-primary">
          <ArrowLeft size={16} /> Back to Leads
        </Link>
      </div>
    );
  }

  const handleLogActivity = () => {
    if (!activityContent.trim()) return;
    addActivity({ leadId: id, type: activityType, content: activityContent.trim() });
    setActivityContent('');
  };

  const handleInsertTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const primaryContact = contacts.find(c => c.isPrimary) || contacts[0];
    let content = template.content;
    
    // Dynamic Variable Replacement
    content = content.replace(/\{\{CompanyName\}\}/g, lead.companyName);
    content = content.replace(/\{\{Sector\}\}/g, lead.sector || 'your sector');
    content = content.replace(/\{\{City\}\}/g, lead.city || 'your city');
    content = content.replace(/\{\{ContactName\}\}/g, primaryContact ? primaryContact.name : 'there');

    const subjectLine = template.subject ? `Subject: ${template.subject.replace(/\{\{CompanyName\}\}/g, lead.companyName)}\n\n` : '';
    setActivityContent(subjectLine + content);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    addContact({
      leadId: id,
      name: newContact.name,
      title: newContact.title,
      phone: newContact.phone,
      email: newContact.email,
      linkedinUrl: newContact.linkedinUrl,
      isPrimary: contacts.length === 0,
      isChampion: false,
    });
    setNewContact({ name: '', title: '', phone: '', email: '', linkedinUrl: '' });
    setShowAddContact(false);
  };

  const handleDeleteLead = () => {
    if (confirm(`Delete ${lead.companyName}? This cannot be undone.`)) {
      deleteLead(id);
      router.push('/crm/leads');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6 crm-animate-in">
      {/* Back + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/crm/leads" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Leads
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleDeleteLead} className="crm-btn-secondary text-red-400 hover:text-red-300 hover:border-red-500/30">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: Company Info */}
        <div className="space-y-4">
          {/* Company Card */}
          <div className="crm-card p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${getStageColor(lead.stage)}20` }}>
                <Building2 size={22} style={{ color: getStageColor(lead.stage) }} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white leading-tight">{lead.companyName}</h1>
                <p className="text-sm text-slate-400 mt-0.5">{lead.sector}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={14} className="text-slate-600 shrink-0" />
                <span>{lead.city}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Globe size={14} className="text-slate-600 shrink-0" />
                <span className="truncate">{lead.internationalPresence}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <BookOpen size={14} className="text-slate-600 shrink-0" />
                <span>{lead.fundingStage}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Star size={14} className="text-slate-600 shrink-0" />
                <span>{lead.englishRequirement}</span>
              </div>
            </div>

            {/* Score */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Score</span>
              <span className="crm-score text-lg" style={{
                background: `${getScoreColor(lead.score)}15`,
                color: getScoreColor(lead.score),
                width: 44, height: 44,
              }}>
                {lead.score}
              </span>
            </div>
          </div>

          {/* Stage + Deal */}
          <div className="crm-card p-6 space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Pipeline Stage</label>
              <div className="relative">
                <select value={lead.stage}
                  onChange={e => moveLead(id, e.target.value as PipelineStage)}
                  className="crm-input pr-8 appearance-none cursor-pointer font-medium"
                  style={{ color: getStageColor(lead.stage) }}>
                  {PIPELINE_STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Deal Value (MAD)</label>
              <div className="flex items-center gap-2">
                <DollarSign size={14} className="text-slate-600" />
                <input type="number" value={lead.dealValue || ''}
                  onChange={e => updateLead(id, { dealValue: Number(e.target.value) })}
                  className="crm-input" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Next Follow-up</label>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-600" />
                <input type="date" value={lead.nextFollowup || ''}
                  onChange={e => updateLead(id, { nextFollowup: e.target.value || null })}
                  className="crm-input" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Source</label>
              <input value={lead.source}
                onChange={e => updateLead(id, { source: e.target.value })}
                className="crm-input" placeholder="LinkedIn / Referral / Event" />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400">
                    {tag}
                    <button onClick={() => updateLead(id, { tags: lead.tags.filter(t => t !== tag) })}
                      className="hover:text-white"><X size={10} /></button>
                  </span>
                ))}
                <button onClick={() => {
                  const tag = prompt('Enter tag:');
                  if (tag) updateLead(id, { tags: [...lead.tags, tag] });
                }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                  <Plus size={10} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="crm-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Contacts</h3>
              <button onClick={() => setShowAddContact(!showAddContact)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                <UserPlus size={12} /> Add
              </button>
            </div>

            {showAddContact && (
              <form onSubmit={handleAddContact} className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <input className="crm-input py-2 text-xs" placeholder="Name *" required
                  value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} />
                <input className="crm-input py-2 text-xs" placeholder="Title"
                  value={newContact.title} onChange={e => setNewContact(p => ({ ...p, title: e.target.value }))} />
                <input className="crm-input py-2 text-xs" placeholder="Phone"
                  value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} />
                <input className="crm-input py-2 text-xs" placeholder="Email"
                  value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} />
                <input className="crm-input py-2 text-xs" placeholder="LinkedIn URL"
                  value={newContact.linkedinUrl} onChange={e => setNewContact(p => ({ ...p, linkedinUrl: e.target.value }))} />
                <div className="flex gap-2">
                  <button type="submit" className="crm-btn-primary text-xs py-2 px-3"><Save size={12} /> Save</button>
                  <button type="button" onClick={() => setShowAddContact(false)} className="crm-btn-secondary text-xs py-2 px-3">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        {c.name}
                        {c.isPrimary && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 uppercase">Primary</span>}
                        {c.isChampion && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase">Champion</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.title}</p>
                    </div>
                    <button onClick={() => deleteContact(c.id)} className="text-slate-700 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
                        <Phone size={11} className="text-slate-600" /> {c.phone}
                      </a>
                    )}
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
                        <Mail size={11} className="text-slate-600" /> {c.email}
                      </a>
                    )}
                    {c.linkedinUrl && (
                      <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white">
                        <Globe size={11} className="text-slate-600" /> LinkedIn <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && !showAddContact && (
                <p className="text-xs text-slate-600 text-center py-4">No contacts yet</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Activity Timeline */}
        <div className="xl:col-span-2 space-y-4">
          {/* Activity Logger */}
          <div className="crm-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Log Activity</h3>

            {/* Type Selector */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(Object.entries(ACTIVITY_TYPE_CONFIG) as [ActivityType, typeof ACTIVITY_TYPE_CONFIG[ActivityType]][]).map(([type, config]) => {
                const Icon = ACTIVITY_ICONS[type] || StickyNote;
                const active = activityType === type;
                return (
                  <button key={type} onClick={() => setActivityType(type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'text-white'
                        : 'bg-white/[0.03] text-slate-500 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    style={active ? { background: `${config.color}20`, color: config.color } : undefined}>
                    <Icon size={14} />
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Template Selector (Shown only for Email/LinkedIn) */}
            {(activityType === 'email' || activityType === 'linkedin') && templates.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Insert Template:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {templates.map(t => (
                    <button key={t.id} onClick={() => handleInsertTemplate(t.id)}
                      className="text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors whitespace-nowrap border border-white/5">
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Area */}
            <textarea value={activityContent} onChange={e => setActivityContent(e.target.value)}
              className="crm-input min-h-[100px] resize-y"
              placeholder={`Describe the ${ACTIVITY_TYPE_CONFIG[activityType].label.toLowerCase()}...`}
            />

            <div className="flex justify-end mt-3">
              <button onClick={handleLogActivity} disabled={!activityContent.trim()}
                className="crm-btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
                <Plus size={14} /> Log {ACTIVITY_TYPE_CONFIG[activityType].label}
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="crm-card p-6">
            <h3 className="text-sm font-semibold text-white mb-6">
              Activity Timeline <span className="text-slate-600 font-normal ml-2">({activities.length})</span>
            </h3>

            {activities.length === 0 ? (
              <div className="text-center py-12">
                <StickyNote size={32} className="text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No activities logged yet</p>
                <p className="text-xs text-slate-600 mt-1">Use the form above to log your first interaction</p>
              </div>
            ) : (
              <div className="space-y-0">
                {activities.map(act => {
                  const Icon = ACTIVITY_ICONS[act.type] || StickyNote;
                  const config = ACTIVITY_TYPE_CONFIG[act.type];
                  return (
                    <div key={act.id} className="crm-timeline-item crm-animate-in">
                      <div className="crm-timeline-dot" style={{ background: `${config.color}20` }}>
                        <Icon size={12} style={{ color: config.color }} />
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-white">{act.userName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${config.color}15`, color: config.color }}>
                            {config.label}
                          </span>
                          <span className="text-[10px] text-slate-600 ml-auto">
                            {new Date(act.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                            {' · '}
                            {new Date(act.createdAt).toLocaleTimeString('en-GB', {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{act.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
