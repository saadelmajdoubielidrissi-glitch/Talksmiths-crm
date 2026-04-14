'use client';
import React, { useState } from 'react';
import { Save, Trash2, Plus, GripVertical, X, Download, RefreshCw } from 'lucide-react';
import { useCRM } from '../lib/store';
import { PIPELINE_STAGES } from '../lib/types';

export default function SettingsPage() {
  const { leads, activities, contacts, partners } = useCRM();
  const [activeTab, setActiveTab] = useState<'general' | 'pipeline' | 'scoring' | 'data'>('general');

  const tabs = [
    { id: 'general' as const, label: 'General' },
    { id: 'pipeline' as const, label: 'Pipeline Stages' },
    { id: 'scoring' as const, label: 'Lead Scoring' },
    { id: 'data' as const, label: 'Data Management' },
  ];

  const handleExportLeads = () => {
    const headers = ['Company', 'Sector', 'City', 'Funding', 'English Req.', 'Score', 'Stage', 'Deal Value', 'Source'];
    const rows = leads.map(l => [
      l.companyName, l.sector, l.city, l.fundingStage, l.englishRequirement,
      l.score, l.stage, l.dealValue, l.source,
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talksmiths_crm_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportActivities = () => {
    const headers = ['Lead', 'Type', 'User', 'Content', 'Date'];
    const rows = activities.map(a => {
      const lead = leads.find(l => l.id === a.leadId);
      return [lead?.companyName || '', a.type, a.userName, a.content, a.createdAt];
    });
    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talksmiths_activities_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('This will reset ALL CRM data to demo defaults. Are you sure?')) {
      localStorage.removeItem('crm_leads');
      localStorage.removeItem('crm_contacts');
      localStorage.removeItem('crm_activities');
      localStorage.removeItem('crm_partners');
      localStorage.removeItem('crm_commissions');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="crm-page-header">
        <h1 className="crm-page-title">Settings</h1>
        <p className="crm-page-subtitle">Configure your CRM preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-500 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="crm-card p-6 space-y-6 max-w-2xl crm-animate-in">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Organization Name</label>
                <input className="crm-input" defaultValue="Talksmiths" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Default Currency</label>
                <input className="crm-input" defaultValue="MAD (Moroccan Dirham)" readOnly />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Default Commission Rate (%)</label>
                <input className="crm-input" type="number" defaultValue={15} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h3 className="text-sm font-semibold text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              {[
                { label: 'Follow-up reminders', desc: 'Get notified when a lead needs follow-up', checked: true },
                { label: 'Stage change alerts', desc: 'When a lead moves to a new pipeline stage', checked: true },
                { label: 'Stale lead warnings', desc: 'Leads with no activity for 7+ days', checked: true },
                { label: 'New lead assignments', desc: 'When a lead is assigned to you', checked: false },
              ].map(item => (
                <label key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked}
                    className="mt-0.5 rounded border-slate-600 bg-transparent text-indigo-500 focus:ring-indigo-500" />
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="crm-card p-6 max-w-2xl crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Pipeline Stages</h3>
          <p className="text-xs text-slate-500 mb-6">Define the stages a deal moves through from first contact to close.</p>
          <div className="space-y-2">
            {PIPELINE_STAGES.map(stage => (
              <div key={stage.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <GripVertical size={14} className="text-slate-700 cursor-grab" />
                <div className="w-3 h-3 rounded-full" style={{ background: stage.color }} />
                <span className="text-sm text-white flex-1">{stage.name}</span>
                <span className="text-xs text-slate-500">{stage.probability}% probability</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 mt-4">
            Pipeline stage customization will be available with Supabase integration.
          </p>
        </div>
      )}

      {/* Scoring Tab */}
      {activeTab === 'scoring' && (
        <div className="crm-card p-6 max-w-2xl crm-animate-in">
          <h3 className="text-sm font-semibold text-white mb-4">Lead Scoring Rules</h3>
          <p className="text-xs text-slate-500 mb-6">Scores are calculated based on three factors (max 100 points).</p>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Sector Score (0-30 pts)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">BPO, IT, FinTech, SaaS, Consulting</span>
                  <span className="text-emerald-400 font-bold">30 pts</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Telecom, Automotive, Pharma, Logistics</span>
                  <span className="text-amber-400 font-bold">20 pts</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Other sectors</span>
                  <span className="text-slate-400 font-bold">10 pts</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">English Requirement (0-40 pts)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Very High / English-Only</span>
                  <span className="text-emerald-400 font-bold">40 pts</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">High</span>
                  <span className="text-cyan-400 font-bold">30 pts</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Medium-High</span>
                  <span className="text-amber-400 font-bold">20 pts</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">International Presence (0-30 pts)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Global / US / UK / Worldwide</span>
                  <span className="text-emerald-400 font-bold">30 pts</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Europe / Africa / Middle East</span>
                  <span className="text-cyan-400 font-bold">20 pts</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-slate-300">Regional / Morocco only</span>
                  <span className="text-slate-400 font-bold">10 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div className="space-y-4 max-w-2xl crm-animate-in">
          {/* Data Summary */}
          <div className="crm-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Data Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Leads', count: leads.length },
                { label: 'Contacts', count: contacts.length },
                { label: 'Activities', count: activities.length },
                { label: 'Partners', count: partners.length },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] text-center">
                  <p className="text-lg font-bold text-white">{item.count}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="crm-card p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Export Data</h3>
            <div className="space-y-3">
              <button onClick={handleExportLeads} className="crm-btn-secondary w-full justify-center">
                <Download size={14} /> Export Leads (CSV)
              </button>
              <button onClick={handleExportActivities} className="crm-btn-secondary w-full justify-center">
                <Download size={14} /> Export Activities (CSV)
              </button>
            </div>
          </div>

          {/* Reset */}
          <div className="crm-card p-6 border-red-500/10">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-slate-500 mb-4">
              Reset all CRM data to demo defaults. This cannot be undone.
            </p>
            <button onClick={handleResetData}
              className="crm-btn-secondary text-red-400 border-red-500/20 hover:bg-red-500/10">
              <RefreshCw size={14} /> Reset to Demo Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
