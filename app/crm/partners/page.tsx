'use client';
import React, { useState } from 'react';
import { UserPlus, Users, DollarSign, Target, TrendingUp, Mail, Phone, X, Plus, Save } from 'lucide-react';
import { useCRM } from '../lib/store';

export default function PartnersPage() {
  const { partners, leads, addPartner, updatePartner } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '', email: '', phone: '', commissionRate: 15,
    territories: '', sectors: '', userId: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addPartner({
      userId: `user-${Date.now()}`,
      name: newPartner.name,
      email: newPartner.email,
      phone: newPartner.phone,
      commissionRate: newPartner.commissionRate,
      territories: newPartner.territories.split(',').map(t => t.trim()).filter(Boolean),
      sectors: newPartner.sectors.split(',').map(s => s.trim()).filter(Boolean),
      status: 'active',
    });
    setShowAddModal(false);
    setNewPartner({ name: '', email: '', phone: '', commissionRate: 15, territories: '', sectors: '', userId: '' });
  };

  const getPartnerStats = (partnerId: string) => {
    const partnerLeads = leads.filter(l => l.assignedTo === partnerId);
    const won = partnerLeads.filter(l => l.stage === 'closed_won');
    const totalValue = won.reduce((s, l) => s + l.dealValue, 0);
    return {
      totalLeads: partnerLeads.length,
      wonDeals: won.length,
      totalValue,
      pipelineValue: partnerLeads.filter(l => l.stage !== 'closed_won' && l.stage !== 'closed_lost')
        .reduce((s, l) => s + l.dealValue, 0),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="crm-page-title">Partners</h1>
          <p className="crm-page-subtitle">Manage your commission-based sales team</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="crm-btn-primary">
          <UserPlus size={16} /> Add Partner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="crm-stat-card" data-accent="indigo">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Partners</p>
          <p className="text-2xl font-bold text-white">{partners.length}</p>
        </div>
        <div className="crm-stat-card" data-accent="emerald">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active</p>
          <p className="text-2xl font-bold text-white">{partners.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="crm-stat-card" data-accent="amber">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Avg Commission Rate</p>
          <p className="text-2xl font-bold text-white">
            {partners.length > 0 ? `${(partners.reduce((s, p) => s + p.commissionRate, 0) / partners.length).toFixed(0)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Partner Cards */}
      {partners.length === 0 ? (
        <div className="crm-card p-12 text-center crm-animate-in">
          <Users size={48} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Partners Yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            When you bring on commission-based sales people, add them here. They&apos;ll get their own login to track their leads and commissions.
          </p>
          <button onClick={() => setShowAddModal(true)} className="crm-btn-primary">
            <UserPlus size={16} /> Add Your First Partner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map(partner => {
            const stats = getPartnerStats(partner.userId);
            return (
              <div key={partner.id} className="crm-card p-6 crm-animate-in">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{partner.name}</p>
                      <p className="text-xs text-slate-500">{partner.commissionRate}% commission</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    partner.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                  }`}>
                    {partner.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/[0.02]">
                    <p className="text-[10px] text-slate-500 uppercase">Leads</p>
                    <p className="text-lg font-bold text-white">{stats.totalLeads}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02]">
                    <p className="text-[10px] text-slate-500 uppercase">Won</p>
                    <p className="text-lg font-bold text-emerald-400">{stats.wonDeals}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  {partner.email && (
                    <div className="flex items-center gap-2"><Mail size={12} className="text-slate-600" /> {partner.email}</div>
                  )}
                  {partner.phone && (
                    <div className="flex items-center gap-2"><Phone size={12} className="text-slate-600" /> {partner.phone}</div>
                  )}
                  {partner.territories.length > 0 && (
                    <div className="flex items-center gap-2"><Target size={12} className="text-slate-600" /> {partner.territories.join(', ')}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="crm-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="crm-modal crm-animate-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Sales Partner</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Name *</label>
                <input className="crm-input" required value={newPartner.name}
                  onChange={e => setNewPartner(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                  <input className="crm-input" type="email" value={newPartner.email}
                    onChange={e => setNewPartner(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Phone</label>
                  <input className="crm-input" value={newPartner.phone}
                    onChange={e => setNewPartner(p => ({ ...p, phone: e.target.value }))} placeholder="+212 6XX XXX XXX" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Commission Rate (%)</label>
                <input className="crm-input" type="number" min={1} max={100} value={newPartner.commissionRate}
                  onChange={e => setNewPartner(p => ({ ...p, commissionRate: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Territories (comma-separated)</label>
                <input className="crm-input" value={newPartner.territories}
                  onChange={e => setNewPartner(p => ({ ...p, territories: e.target.value }))} placeholder="Casablanca, Rabat, Tangier" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Sectors (comma-separated)</label>
                <input className="crm-input" value={newPartner.sectors}
                  onChange={e => setNewPartner(p => ({ ...p, sectors: e.target.value }))} placeholder="BPO, FinTech, IT Services" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="crm-btn-secondary">Cancel</button>
                <button type="submit" className="crm-btn-primary"><Save size={14} /> Add Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
