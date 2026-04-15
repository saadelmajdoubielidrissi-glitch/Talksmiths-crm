'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Kanban, UserCog, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useCRM } from '../lib/store';

const NAV_ITEMS = [
  { href: '/crm', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm/leads', label: 'Leads', icon: Users },
  { href: '/crm/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/crm/partners', label: 'Partners', icon: UserCog },
  { href: '/crm/reports', label: 'Reports', icon: BarChart3 },
  { href: '/crm/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useCRM();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/crm') return pathname === '/crm';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0c0d12 0%, #111318 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white tracking-wide">Talksmiths</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Command Center</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={`shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/5 p-3 space-y-2">
        {/* User */}
        {currentUser && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: currentUser.avatarColor }}>
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.role === 'admin' ? 'Administrator' : 'Sales Partner'}</p>
            </div>
          </div>
        )}
        {/* Logout */}
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-400 transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
