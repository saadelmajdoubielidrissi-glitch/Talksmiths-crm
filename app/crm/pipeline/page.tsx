'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { GripVertical, Clock, DollarSign, User } from 'lucide-react';
import { useCRM } from '../lib/store';
import { PIPELINE_STAGES, PipelineStage, getStageColor, getStageName } from '../lib/types';

export default function PipelinePage() {
  const { leads, moveLead, contacts } = useCRM();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getLeadsForStage = (stage: PipelineStage) =>
    leads.filter(l => l.stage === stage).sort((a, b) => b.score - a.score);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (draggedId) {
      moveLead(draggedId, stage);
      setDraggedId(null);
    }
  };

  const getDaysInStage = (updatedAt: string) => {
    return Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 86400));
  };

  const totalByStage = (stage: PipelineStage) =>
    getLeadsForStage(stage).reduce((sum, l) => sum + l.dealValue, 0);

  return (
    <div className="space-y-6">
      <div className="crm-page-header">
        <h1 className="crm-page-title">Pipeline</h1>
        <p className="crm-page-subtitle">Drag cards between stages to update deal progress</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {PIPELINE_STAGES.map(stage => {
          const stageLeads = getLeadsForStage(stage.id);
          const stageValue = totalByStage(stage.id);
          return (
            <div key={stage.id} className="crm-kanban-column"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, stage.id)}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                  <span className="text-xs font-semibold text-white">{stage.name}</span>
                  <span className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                {stageValue > 0 && (
                  <span className="text-[10px] text-slate-500">
                    {(stageValue / 1000).toFixed(0)}K
                  </span>
                )}
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[100px] p-1 rounded-xl transition-colors"
                style={{ background: draggedId ? 'rgba(99,102,241,0.03)' : 'transparent' }}>
                {stageLeads.map(lead => {
                  const contact = contacts.find(c => c.leadId === lead.id && c.isPrimary);
                  const days = getDaysInStage(lead.updatedAt);
                  const isStale = days > 7 && stage.id !== 'closed_won' && stage.id !== 'closed_lost';

                  return (
                    <div key={lead.id}
                      draggable
                      onDragStart={e => handleDragStart(e, lead.id)}
                      className={`crm-kanban-card crm-animate-in ${isStale ? 'border-amber-500/20' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/crm/leads/${lead.id}`}
                          className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors leading-tight">
                          {lead.companyName}
                        </Link>
                        <GripVertical size={14} className="text-slate-700 shrink-0 cursor-grab" />
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">{lead.sector}</p>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-3">
                          {contact && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <User size={10} /> {contact.name.split(' ')[0]}
                            </span>
                          )}
                          {lead.dealValue > 0 && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <DollarSign size={10} /> {(lead.dealValue / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>
                        <span className={`flex items-center gap-1 ${isStale ? 'text-amber-400' : 'text-slate-600'}`}>
                          <Clock size={10} /> {days}d
                        </span>
                      </div>

                      {/* Score bar */}
                      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${lead.score}%`,
                            background: lead.score >= 85 ? '#10b981' : lead.score >= 70 ? '#f59e0b' : '#ef4444',
                          }} />
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-700">
                    Drop leads here
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
