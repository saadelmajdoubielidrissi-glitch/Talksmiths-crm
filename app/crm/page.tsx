'use client';
import React from 'react';
import {
  TrendingUp, DollarSign, Target, CalendarClock,
  Users, AlertTriangle, Phone, Mail, MessageSquare, StickyNote, ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import { useCRM } from './lib/store';
import { PIPELINE_STAGES, getStageName, getStageColor } from './lib/types';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  call: Phone, email: Mail, meeting: Users, note: StickyNote, linkedin: MessageSquare,
};

function StatCard({ label, value, subtitle, accent, icon: Icon }: {
  label: string; value: string; subtitle?: string; accent: string; icon: React.ElementType;
}) {
  return (
    <div className="crm-stat-card crm-animate-in" data-accent={accent}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Icon size={20} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    leads, getPipelineValue, getConversionRate, getFollowupsDueToday,
    getRecentActivities, getLeadsByStage, getSectorBreakdown
  } = useCRM();

  const pipelineValue = getPipelineValue();
  const conversionRate = getConversionRate();
  const followups = getFollowupsDueToday();
  const recentActivities = getRecentActivities(10);
  const leadsByStage = getLeadsByStage();
  const sectorData = getSectorBreakdown().slice(0, 6);

  const activeLeads = leads.filter(l => l.stage !== 'closed_won' && l.stage !== 'closed_lost').length;
  const staleLeads = leads.filter(l => {
    const daysSince = (Date.now() - new Date(l.updatedAt).getTime()) / (1000 * 86400);
    return daysSince > 7 && l.stage !== 'closed_won' && l.stage !== 'closed_lost';
  }).length;

  // Pipeline chart data
  const pipelineChartData = PIPELINE_STAGES
    .filter(s => s.id !== 'closed_lost')
    .map(stage => ({
      name: stage.name,
      count: (leadsByStage[stage.id] || []).length,
      color: stage.color,
    }));

  // Sector pie colors
  const PIE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

  const formatMAD = (v: number) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M MAD`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K MAD`;
    return `${v} MAD`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="crm-page-header">
        <h1 className="crm-page-title">Dashboard</h1>
        <p className="crm-page-subtitle">Welcome back. Here&apos;s your sales overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Pipeline Value" value={formatMAD(pipelineValue)} accent="indigo" icon={DollarSign} />
        <StatCard label="Active Leads" value={String(activeLeads)} accent="cyan" icon={Users} />
        <StatCard label="Conversion Rate" value={conversionRate > 0 ? `${conversionRate}%` : '—'} accent="emerald" icon={TrendingUp} />
        <StatCard label="Follow-ups Today" value={String(followups.length)} accent="amber" icon={CalendarClock}
          subtitle={followups.length > 0 ? 'Action required' : 'All clear'} />
        <StatCard label="Closed Won" value={String((leadsByStage['closed_won'] || []).length)} accent="emerald" icon={Target} />
        <StatCard label="Stale Leads" value={String(staleLeads)} accent="rose" icon={AlertTriangle}
          subtitle={staleLeads > 0 ? '7+ days idle' : 'None'} />
      </div>

      {/* Charts + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <div className="crm-card p-6 xl:col-span-2 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-6">Pipeline Overview</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineChartData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                  cursor={{ fill: 'rgba(99,102,241,0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-6">Top Sectors</h3>
          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorData} dataKey="count" nameKey="sector" cx="50%" cy="50%"
                  outerRadius={70} innerRadius={40} strokeWidth={0}>
                  {sectorData.map((_, index) => (
                    <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {sectorData.map((s, i) => (
              <div key={s.sector} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-slate-400 truncate max-w-[140px]">{s.sector}</span>
                </div>
                <span className="text-slate-500">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-ups + Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Follow-ups Due */}
        <div className="crm-card p-6 crm-animate-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Follow-ups Due</h3>
            <Link href="/crm/leads" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          {followups.length === 0 ? (
            <div className="text-center py-8">
              <CalendarClock size={32} className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No follow-ups due today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {followups.slice(0, 5).map(lead => (
                <Link key={lead.id} href={`/crm/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div>
                    <p className="text-sm text-white font-medium">{lead.companyName}</p>
                    <p className="text-xs text-slate-500">{lead.sector}</p>
                  </div>
                  <span className="crm-stage-badge text-[10px]" style={{
                    background: `${getStageColor(lead.stage)}20`,
                    color: getStageColor(lead.stage),
                  }}>
                    {getStageName(lead.stage)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="crm-card p-6 crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-1 max-h-[320px] overflow-y-auto">
            {recentActivities.map(act => {
              const Icon = ACTIVITY_ICONS[act.type] || MessageSquare;
              const lead = leads.find(l => l.id === act.leadId);
              return (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Icon size={14} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white">
                      <span className="font-semibold">{act.userName}</span>
                      {' logged a '}
                      <span className="text-indigo-400">{act.type}</span>
                      {lead && (
                        <>
                          {' on '}
                          <Link href={`/crm/leads/${lead.id}`} className="text-indigo-400 hover:underline">{lead.companyName}</Link>
                        </>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{act.content}</p>
                    <p className="text-[10px] text-slate-700 mt-1">
                      {new Date(act.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
