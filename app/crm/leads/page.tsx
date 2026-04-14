'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, ArrowUpDown, X, Building2, MapPin, ChevronDown, Trash2 } from 'lucide-react';
import { useCRM } from '../lib/store';
import { Lead, PipelineStage, PIPELINE_STAGES, getStageName, getStageColor } from '../lib/types';

export default function LeadsPage() {
  const { leads, addLead, addContact, contacts } = useCRM();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'all'>('all');
  const [sectorFilter, setSectorFilter] = useState('All Sectors');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [sortBy, setSortBy] = useState<'score' | 'company' | 'updated' | 'value'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // Dynamic Filters
  const SECTORS = useMemo(() => ['All Sectors', ...Array.from(new Set(leads.map(l => l.sector).filter(Boolean))).sort()], [leads]);
  const CITIES = useMemo(() => ['All Cities', ...Array.from(new Set(leads.map(l => l.city).filter(Boolean))).sort()], [leads]);

  // New lead form state
  const [newLead, setNewLead] = useState({
    companyName: '', sector: '', city: 'Casablanca', fundingStage: '',
    englishRequirement: '', internationalPresence: '', dealValue: 0,
    contactName: '', contactTitle: '', contactPhone: '', contactEmail: '',
  });

  const filteredLeads = useMemo(() => {
    let result = [...leads];
    const q = search.toLowerCase();

    // Search
    if (q) {
      result = result.filter(l => {
        const leadContacts = contacts.filter(c => c.leadId === l.id);
        return l.companyName.toLowerCase().includes(q) ||
          l.sector.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          leadContacts.some(c => c.name.toLowerCase().includes(q));
      });
    }

    // Stage filter
    if (stageFilter !== 'all') {
      result = result.filter(l => l.stage === stageFilter);
    }

    // Sector filter
    if (sectorFilter !== 'All Sectors') {
      result = result.filter(l => l.sector.toLowerCase().includes(sectorFilter.toLowerCase()));
    }

    // City filter
    if (cityFilter !== 'All Cities') {
      result = result.filter(l => l.city.toLowerCase().includes(cityFilter.toLowerCase()));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'score': cmp = a.score - b.score; break;
        case 'company': cmp = a.companyName.localeCompare(b.companyName); break;
        case 'updated': cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
        case 'value': cmp = a.dealValue - b.dealValue; break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [leads, contacts, search, stageFilter, sectorFilter, cityFilter, sortBy, sortDir]);

  const { bulkMoveLeads, bulkDeleteLeads } = useCRM();

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
    } else {
      setSelectedLeadIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedLeadIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedLeadIds(newSet);
  };

  const handleBulkMove = (stage: PipelineStage) => {
    bulkMoveLeads(Array.from(selectedLeadIds), stage);
    setSelectedLeadIds(new Set());
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedLeadIds.size} leads?`)) {
      bulkDeleteLeads(Array.from(selectedLeadIds));
      setSelectedLeadIds(new Set());
    }
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = addLead({
      companyName: newLead.companyName,
      sector: newLead.sector,
      city: newLead.city,
      fundingStage: newLead.fundingStage,
      englishRequirement: newLead.englishRequirement,
      internationalPresence: newLead.internationalPresence,
      stage: 'new_lead',
      dealValue: newLead.dealValue,
      assignedTo: 'user-1',
      source: 'Manual',
      tags: [],
      nextFollowup: null,
    });

    // Add contact if provided
    if (newLead.contactName) {
      addContact({
        leadId: lead.id,
        name: newLead.contactName,
        title: newLead.contactTitle,
        phone: newLead.contactPhone,
        email: newLead.contactEmail,
        linkedinUrl: '',
        isPrimary: true,
        isChampion: false,
      });
    }

    setShowAddModal(false);
    setNewLead({
      companyName: '', sector: '', city: 'Casablanca', fundingStage: '',
      englishRequirement: '', internationalPresence: '', dealValue: 0,
      contactName: '', contactTitle: '', contactPhone: '', contactEmail: '',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getPrimaryContact = (leadId: string) => {
    return contacts.find(c => c.leadId === leadId && c.isPrimary);
  };

  const activeFilters = [stageFilter !== 'all', sectorFilter !== 'All Sectors', cityFilter !== 'All Cities'].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="crm-page-title">Leads</h1>
          <p className="crm-page-subtitle">{filteredLeads.length} of {leads.length} companies</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="crm-btn-primary">
          <Plus size={16} />
          New Lead
        </button>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedLeadIds.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl crm-animate-in">
          <span className="text-sm font-semibold text-indigo-400 pl-2 border-r border-indigo-500/20 pr-4">
            {selectedLeadIds.size} selected
          </span>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Move to:</span>
            <select 
              onChange={e => handleBulkMove(e.target.value as PipelineStage)}
              className="crm-input py-1.5 px-3 text-xs w-[140px]"
              value=""
            >
              <option value="" disabled className="bg-slate-900">Select stage...</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1" />
          
          <button onClick={handleBulkDelete} className="crm-btn-secondary text-red-400 border-red-500/20 hover:bg-red-500/10 py-1.5 px-3 text-xs">
            <Trash2 size={14} /> Delete
          </button>
          
          <button onClick={() => setSelectedLeadIds(new Set())} className="text-slate-500 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search companies, contacts, sectors..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="crm-input pl-10"
          />
        </div>

        <div className="relative">
          <select value={stageFilter} onChange={e => setStageFilter(e.target.value as PipelineStage | 'all')}
            className="crm-input pr-8 appearance-none cursor-pointer min-w-[140px]"
            style={{ backgroundImage: 'none' }}>
            <option value="all" className="bg-slate-900">All Stages</option>
            {PIPELINE_STAGES.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
            className="crm-input pr-8 appearance-none cursor-pointer min-w-[130px]"
            style={{ backgroundImage: 'none' }}>
            {SECTORS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
            className="crm-input pr-8 appearance-none cursor-pointer min-w-[130px]"
            style={{ backgroundImage: 'none' }}>
            {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {activeFilters > 0 && (
          <button onClick={() => { setStageFilter('all'); setSectorFilter('All Sectors'); setCityFilter('All Cities'); }}
            className="crm-btn-secondary text-xs py-2 px-3">
            <X size={14} /> Clear ({activeFilters})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="crm-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="crm-table">
            <thead>
              <tr>
                <th className="w-8">
                  <input type="checkbox" 
                    checked={selectedLeadIds.size > 0 && selectedLeadIds.size === filteredLeads.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-600 bg-transparent text-indigo-500 focus:ring-indigo-500" 
                  />
                </th>
                <th onClick={() => toggleSort('score')} className="cursor-pointer hover:text-white w-[60px]">
                  <span className="flex items-center gap-1">Score <ArrowUpDown size={12} /></span>
                </th>
                <th onClick={() => toggleSort('company')} className="cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Company <ArrowUpDown size={12} /></span>
                </th>
                <th>Contact</th>
                <th>Sector</th>
                <th>City</th>
                <th>Stage</th>
                <th onClick={() => toggleSort('value')} className="cursor-pointer hover:text-white">
                  <span className="flex items-center gap-1">Value <ArrowUpDown size={12} /></span>
                </th>
                <th>Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => {
                const contact = getPrimaryContact(lead.id);
                const isSelected = selectedLeadIds.has(lead.id);
                return (
                  <tr key={lead.id} className={`crm-animate-in ${isSelected ? 'bg-indigo-500/5' : ''}`} style={{ animationDelay: `${index * 5}ms` }}>
                    <td>
                      <input type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(lead.id, e.target.checked)}
                        className="rounded border-slate-600 bg-transparent text-indigo-500 focus:ring-indigo-500" 
                      />
                    </td>
                    <td>
                      <span className="crm-score" style={{
                        background: `${getScoreColor(lead.score)}15`,
                        color: getScoreColor(lead.score),
                      }}>
                        {lead.score}
                      </span>
                    </td>
                    <td>
                      <Link href={`/crm/leads/${lead.id}`} className="hover:text-indigo-400 transition-colors">
                        <p className="font-semibold text-white text-sm">{lead.companyName}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{lead.fundingStage}</p>
                      </Link>
                    </td>
                    <td>
                      {contact ? (
                        <div>
                          <p className="text-sm text-slate-300">{contact.name}</p>
                          <p className="text-[11px] text-slate-600">{contact.title}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">No contact</span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm text-slate-400">{lead.sector}</span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-sm text-slate-400">
                        <MapPin size={12} className="text-slate-600" />{lead.city}
                      </span>
                    </td>
                    <td>
                      <span className="crm-stage-badge" style={{
                        background: `${getStageColor(lead.stage)}20`,
                        color: getStageColor(lead.stage),
                      }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: getStageColor(lead.stage) }} />
                        {getStageName(lead.stage)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-slate-300 font-medium">
                        {lead.dealValue > 0 ? `${(lead.dealValue / 1000).toFixed(0)}K` : '—'}
                      </span>
                    </td>
                    <td>
                      {lead.nextFollowup ? (
                        <span className={`text-xs ${
                          new Date(lead.nextFollowup) <= new Date() ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          {new Date(lead.nextFollowup).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-700">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="crm-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="crm-modal crm-animate-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Company Name *</label>
                  <input className="crm-input" required value={newLead.companyName}
                    onChange={e => setNewLead(p => ({ ...p, companyName: e.target.value }))}
                    placeholder="e.g. ORA Technologies" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Sector</label>
                  <input className="crm-input" value={newLead.sector}
                    onChange={e => setNewLead(p => ({ ...p, sector: e.target.value }))}
                    placeholder="e.g. FinTech / SaaS" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">City</label>
                  <input className="crm-input" value={newLead.city}
                    onChange={e => setNewLead(p => ({ ...p, city: e.target.value }))}
                    placeholder="Casablanca" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Funding Stage</label>
                  <input className="crm-input" value={newLead.fundingStage}
                    onChange={e => setNewLead(p => ({ ...p, fundingStage: e.target.value }))}
                    placeholder="e.g. Series A" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Deal Value (MAD)</label>
                  <input className="crm-input" type="number" value={newLead.dealValue || ''}
                    onChange={e => setNewLead(p => ({ ...p, dealValue: Number(e.target.value) }))}
                    placeholder="150000" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">English Requirement</label>
                  <input className="crm-input" value={newLead.englishRequirement}
                    onChange={e => setNewLead(p => ({ ...p, englishRequirement: e.target.value }))}
                    placeholder="Very High / High / Medium" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">International Presence</label>
                  <input className="crm-input" value={newLead.internationalPresence}
                    onChange={e => setNewLead(p => ({ ...p, internationalPresence: e.target.value }))}
                    placeholder="Global / Europe / Africa" />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Primary Contact (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Contact Name</label>
                    <input className="crm-input" value={newLead.contactName}
                      onChange={e => setNewLead(p => ({ ...p, contactName: e.target.value }))}
                      placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Title</label>
                    <input className="crm-input" value={newLead.contactTitle}
                      onChange={e => setNewLead(p => ({ ...p, contactTitle: e.target.value }))}
                      placeholder="CFO / HR Director" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Phone</label>
                    <input className="crm-input" value={newLead.contactPhone}
                      onChange={e => setNewLead(p => ({ ...p, contactPhone: e.target.value }))}
                      placeholder="+212 6XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                    <input className="crm-input" type="email" value={newLead.contactEmail}
                      onChange={e => setNewLead(p => ({ ...p, contactEmail: e.target.value }))}
                      placeholder="name@company.com" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="crm-btn-secondary">Cancel</button>
                <button type="submit" className="crm-btn-primary">
                  <Plus size={16} /> Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
