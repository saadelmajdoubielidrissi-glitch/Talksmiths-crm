'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CRMProvider, useCRM } from './lib/store';
import { Sidebar } from './components/Sidebar';
import './styles/crm.css';

function CRMAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useCRM();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated && pathname !== '/crm/login') {
      router.push('/crm/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname !== '/crm/login') {
    return (
      <div className="crm-root flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/crm/login') {
    return <div className="crm-root">{children}</div>;
  }

  return (
    <div className="crm-root flex min-h-screen">
      <Sidebar />
      <main className="crm-main flex-1 ml-[260px] min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <CRMProvider>
      <CRMAuthGuard>{children}</CRMAuthGuard>
    </CRMProvider>
  );
}
