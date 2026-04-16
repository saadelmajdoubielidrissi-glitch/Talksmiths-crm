'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GripVertical, Clock, DollarSign, User, Search, Filter } from 'lucide-react';
import { useCRM } from '../lib/store';
import { PIPELINE_STAGES, PipelineStage, getStageColor, getStageName } from '../lib/types';

// Broad sector mapping based on the 1000-prospect dataset structure
const SECTOR_GROUPS = [
  { id: 'all', name: 'All Industries' },
  { id: 'bpo', name: 'BPO & Call Centers', patterns: ['bpo', 'call center', 'cx', 'customer experience', 'outsource'] },
  { id: 'it', name: 'IT & Software', patterns: ['it', 'tech', 'software', 'digital', 'cloud', 'app', 'cyber'] },
  { id: 'finance', name: 'Finance & Banking', patterns: ['bank', 'finance', 'payment', 'fintech', 'insurance', 'audit'] },
  { id: 'retail', name: 'Retail & FMCG', patterns: ['retail', 'fmcg', 'goods', 'fashion', 'textile', 'consumer'] },
  { id: 'auto_aero', name: 'Automotive & Aero', patterns: ['auto', 'aero', 'manufacturing'] },
  { id: 'services', name: 'Professional Services', patterns: ['consulting', 'legal', 'hr', 'recruitment', 'research', 'training'] },
];

export default function PipelinePage() {
  const { leads, moveLead, reorderLead, contacts } = useCRM();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('all');

  // Filter and Sort Logic
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      // Search filter
      const matchesSearch = 
        l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.sector.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Sector filter
      if (activeSector === 'all') return true;
      const group = SECTOR_GROUPS.find(g => g.id === activeSector);
      return group?.patterns?.some(p => l.sector.toLowerCase().includes(p)) ?? true;
    });
  }, [leads, searchQuery, activeSector]);

  const getLeadsForStage = (stage: PipelineStage) =>
    filteredLeads
      .filter(l => l.stage === stage)
      .sort((a, b) => (a.position || 0) - (b.position || 0));

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to hide the original element while dragging
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    if (e.target instanceof HTMLElement) e.target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage, targetIndex?: number) => {
    e.preventDefault();
    if (!draggedId) return;

    const lead = leads.find(l => l.id === draggedId);
    if (!lead) return;

    if (lead.stage !== stage) {
      // Horizontal move
      moveLead(draggedId, stage);
    } else if (targetIndex !== undefined) {
      // Vertical reorder within same stage
      reorderLead(draggedId, targetIndex);
    }
    
    setDraggedId(null);
  };

  const getDaysInStage = (updatedAt: string) => {
    return Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 86400));
  };

  const totalByStage = (stage: PipelineStage) =>
    getLeadsForStage(stage).reduce((sum, l) => sum + (l.dealValue || 0), 0);

  return (
    <div className="space-y-6">
      <div className="crm-page-header flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="crm-page-title">Pipeline</h1>
          <p className="crm-page-subtitle">Manage deals and prioritize your outreach</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative group min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="crm-input pl-9 bg-white/[0.03] border-white/5 hover:bg-white/[0.05]" 
            />
          </div>

          {/* Industry Filter */}
          <div className="relative flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl px-3 h-[42px]">
            <Filter size={14} className="text-slate-500" />
            <select 
              value={activeSector}
              onChange={(e) => setActiveSector(e.target.value)}
              className="bg-transparent text-sm text-slate-300 outline-none pr-4 cursor-pointer"
            >
              {SECTOR_GROUPS.map(g => (
                <option key={g.id} value={g.id} className="bg-[#14161e] text-slate-300">{g.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin" style={{ minHeight: 'calc(100vh - 240px)' }}>
        {PIPELINE_STAGES.map(stage => {
          const stageLeads = getLeadsForStage(stage.id);
          const stageValue = totalByStage(stage.id);
          
          return (
            <div key={stage.id} className="crm-kanban-column"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, stage.id)}>
              
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px] shadow-current" style={{ color: stage.color, background: stage.color }} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{stage.name}</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                    {stageLeads.length}
                  </span>
                </div>
                {stageValue > 0 && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-white/[0.02] px-2 py-0.5 rounded-md">
                    {(stageValue / 1000).toFixed(0)}K MAD
                  </span>
                )}
              </div>

              {/* Cards Container */}
              <div className="space-y-3 min-h-[400px] p-1.5 rounded-2xl transition-all duration-300"
                style={{ background: draggedId ? 'rgba(99,102,241,0.02)' : 'transparent' }}>
                
                {stageLeads.map((lead, index) => {
                  const contact = contacts.find(c => c.leadId === lead.id && c.isPrimary);
                  const days = getDaysInStage(lead.updatedAt);
                  const isStale = days > 7 && stage.id !== 'closed_won' && stage.id !== 'closed_lost';

                  return (
                    <div key={lead.id}
                      draggable
                      onDragStart={e => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => {
                        e.stopPropagation(); // Avoid column drop
                        handleDrop(e, stage.id, index);
                      }}
                      className={`crm-kanban-card group border-white/[0.03] hover:border-indigo-500/30 active:scale-[0.98] ${isStale ? 'border-amber-500/20' : ''}`}>
                      
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/crm/leads/${lead.id}`}
                          className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                          {lead.companyName}
                        </Link>
                        <GripVertical size={14} className="text-slate-800 group-hover:text-slate-600 transition-colors shrink-0 cursor-grab active:cursor-grabbing" />
                      </div>
                      
                      <p className="text-[10px] text-slate-500 font-medium mb-4 line-clamp-1">{lead.sector}</p>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-3">
                          {contact && (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <User size={10} className="text-indigo-400/50" /> 
                              <span className="font-medium">{contact.name.split(' ')[0]}</span>
                            </div>
                          )}
                          {lead.dealValue > 0 && (
                            <div className="flex items-center gap-1 text-slate-400">
                              <DollarSign size={10} className="text-emerald-400/50" /> 
                              <span className="font-medium">{(lead.dealValue / 1000).toFixed(0)}K</span>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${isStale ? 'text-amber-400 bg-amber-400/5' : 'text-slate-600 bg-white/5'}`}>
                          <Clock size={10} /> 
                          <span className="font-bold">{days}d</span>
                        </div>
                      </div>

                      {/* Progress Line */}
                      <div className="mt-4 h-[3px] rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${lead.score}%`,
                            background: lead.score >= 85 ? '#10b981' : lead.score >= 70 ? '#f59e0b' : '#ef4444',
                            boxShadow: `0 0 8px ${lead.score >= 85 ? '#10b98140' : lead.score >= 70 ? '#f59e0b40' : '#ef444440'}`
                          }} />
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <Search size={24} className="text-slate-800 mx-auto mb-2 opacity-50" />
                    <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">No matches</p>
                  </div>
                )}
                
                {stageLeads.length === 0 && !searchQuery && (
                  <div className="flex flex-col items-center justify-center py-12 opacity-20 border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Empty Stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
