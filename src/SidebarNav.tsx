import React, { type ReactNode } from 'react';

export default function SidebarNav() {
  return (
    <nav className="space-y-1">
      <NavLink label="Dashboard">
        <rect x="3" y="3" width="7" height="7" fill="#9CA3AF" />
        <rect x="14" y="3" width="7" height="7" fill="#9CA3AF" />
        <rect x="3" y="14" width="7" height="7" fill="#9CA3AF" />
        <rect x="14" y="14" width="7" height="7" fill="#9CA3AF" />
      </NavLink>
      <NavLink label="Patients" active>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#1C1C1C" />
      </NavLink>
      <NavLink label="Insurance">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#9CA3AF" />
      </NavLink>
      <NavLink label="Task">
        <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" fill="none" />
        <path d="M9 12l2 2 4-4" stroke="#9CA3AF" strokeWidth="2" fill="none" />
      </NavLink>
    </nav>
  );
}

function NavLink({ children, label, active }: { children: ReactNode; label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 ${active ? 'rounded-[20px]' : 'rounded-xl'} border ${
        active ? 'bg-[#F1F1F1] border-[#F1F1F1] dark:bg-slate-800 dark:border-slate-800' : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          {children}
        </svg>
      </div>
      <span className={`text-sm font-medium ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{label}</span>
    </div>
  );
}
