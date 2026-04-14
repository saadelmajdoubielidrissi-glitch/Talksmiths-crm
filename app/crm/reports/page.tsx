'use client';
import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area, FunnelChart, Funnel, LabelList,
} from 'recharts';
import { TrendingUp, DollarSign, Target, Clock, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';
import { useCRM } from '../lib/store';
import { PIPELINE_STAGES, PipelineStage, getStageName, getStageColor } from '../lib/types';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e', '#f97316'];

export default function ReportsPage() {
  const { leads, activities, getSectorBreakdown, getLeadsByStage } = useCRM();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  const leadsByStage = getLeadsByStage();
  const sectorData = getSectorBreakdown();

  // Pipeline funnel data
  const funnelData = PIPELINE_STAGES
    .filter(s => s.id !== 'closed_lost')
    .map(s => ({
      name: s.name,
      value: (leadsByStage[s.id] || []).length,
      fill: s.color,
    }));

  // Conversion between stages
  const conversionData = PIPELINE_STAGES.slice(0, -1).map((stage, i) => {
    const current = (leadsByStage[stage.id] || []).length;
    const next = i < PIPELINE_STAGES.length - 2 ? (leadsByStage[PIPELINE_STAGES[i + 1].id] || []).length : 0;
    const rate = current > 0 ? Math.round((next / current) * 100) : 0;
    return { stage: stage.name, leads: current, conversionRate: rate };
  });

  // Activity by type
  const activityByType = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => { counts[a.type] = (counts[a.type] || 0) + 1; });
    return Object.entries(counts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    })).sort((a, b) => b.count - a.count);
  }, [activities]);

  // Stale leads
  const staleLeads = leads
    .filter(l => {
      const days = (Date.now() - new Date(l.updatedAt).getTime()) / (1000 * 86400);
      return days > 7 && l.stage !== 'closed_won' && l.stage !== 'closed_lost';
    })
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

  // Top leads by value
  const topLeads = [...leads]
    .filter(l => l.stage !== 'closed_lost')
    .sort((a, b) => b.dealValue - a.dealValue)
    .slice(0, 8);

  // City breakdown
  const cityData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.city] = (map[l.city] || 0) + 1; });
    return Object.entries(map)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [leads]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: '90-100', min: 90, max: 100, count: 0 },
      { range: '80-89', min: 80, max: 89, count: 0 },
      { range: '70-79', min: 70, max: 79, count: 0 },
      { range: '60-69', min: 60, max: 69, count: 0 },
      { range: '<60', min: 0, max: 59, count: 0 },
    ];
    leads.forEach(l => {
      const bucket = buckets.find(b => l.score >= b.min && l.score <= b.max);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [leads]);

  const totalPipeline = leads.filter(l => l.stage !== 'closed_lost').reduce((s, l) => s + l.dealValue, 0);
  const weightedPipeline = leads
    .filter(l => l.stage !== 'closed_lost')
    .reduce((s, l) => {
      const prob = PIPELINE_STAGES.find(st => st.id === l.stage)?.probability || 0;
      return s + (l.dealValue * prob / 100);
    }, 0);

  return (
    <div className="space-y-6">
      <div className="crm-page-header">
        <h1 className="crm-page-title">Reports & Analytics</h1>
        <p className="crm-page-subtitle">Sales intelligence across {leads.length} leads</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="crm-stat-card" data-accent="indigo">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Pipeline</p>
          <p className="text-xl font-bold text-white">{(totalPipeline / 1000000).toFixed(1)}M MAD</p>
        </div>
        <div className="crm-stat-card" data-accent="emerald">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weighted Forecast</p>
          <p className="text-xl font-bold text-white">{(weightedPipeline / 1000000).toFixed(1)}M MAD</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Based on stage probabilities</p>
        </div>
        <div className="crm-stat-card" data-accent="cyan">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Activities</p>
          <p className="text-xl font-bold text-white">{activities.length}</p>
        </div>
        <div className="crm-stat-card" data-accent="rose">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stale Leads</p>
          <p className="text-xl font-bold text-white">{staleLeads.length}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">7+ days without activity</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Pipeline Funnel</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" barSize={24}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Sector Performance</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData.slice(0, 8)} barSize={28}>
                <XAxis dataKey="sector" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  formatter={(value: any, name: any) => [name === 'value' ? `${(Number(value)/1000).toFixed(0)}K MAD` : value, name === 'value' ? 'Pipeline Value' : 'Leads']}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity Breakdown */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Activity Breakdown</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activityByType} dataKey="count" nameKey="name" cx="50%" cy="50%"
                  outerRadius={75} innerRadius={45} strokeWidth={0}>
                  {activityByType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {activityByType.map((a, i) => (
              <div key={a.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-slate-400">{a.name}</span>
                </div>
                <span className="text-slate-500 font-medium">{a.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Lead Score Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} barSize={32}>
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? '#10b981' : i === 1 ? '#34d399' : i === 2 ? '#f59e0b' : i === 3 ? '#fb923c' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Breakdown */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Leads by City</h3>
          <div className="space-y-3">
            {cityData.map((c, i) => {
              const pct = leads.length > 0 ? (c.count / leads.length) * 100 : 0;
              return (
                <div key={c.city}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{c.city}</span>
                    <span className="text-slate-500">{c.count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stale Leads + Top Deals */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Stale Leads */}
        <div className="crm-card p-6 crm-animate-in">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Stale Leads</h3>
            <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">{staleLeads.length}</span>
          </div>
          {staleLeads.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">All leads are actively worked 🎉</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {staleLeads.slice(0, 10).map(lead => {
                const days = Math.floor((Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 86400));
                return (
                  <Link key={lead.id} href={`/crm/leads/${lead.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div>
                      <p className="text-sm text-white font-medium">{lead.companyName}</p>
                      <p className="text-xs text-slate-500">{lead.sector}</p>
                    </div>
                    <span className="text-xs text-amber-400 font-medium">{days}d ago</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Deals */}
        <div className="crm-card p-6 crm-animate-in">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Top Deals by Value</h3>
          </div>
          <div className="space-y-2">
            {topLeads.map((lead, i) => (
              <Link key={lead.id} href={`/crm/leads/${lead.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-5">#{i + 1}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{lead.companyName}</p>
                    <p className="text-xs text-slate-500">{lead.sector}</p>
                  </div>
                </div>
                <span className="text-sm text-emerald-400 font-semibold">
                  {(lead.dealValue / 1000).toFixed(0)}K
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
