import React, { useState } from 'react';
import { User } from '../types';
import { ChartBarIcon, CogIcon, LogoutIcon, UserCircleIcon } from './icons';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  children: (view: 'dashboard' | 'settings') => React.ReactNode;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-cyan-600 text-white'
        : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, children }) => {
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-4 flex flex-col border-r border-slate-700">
        <h1 className="text-2xl font-bold text-slate-100">
            IoT Hub Dashboard
          </h1>
        
        <nav className="flex-grow space-y-2">
            <NavLink 
                icon={<ChartBarIcon className="w-6 h-6" />}
                label="Dashboard"
                isActive={view === 'dashboard'}
                onClick={() => setView('dashboard')}
            />
            <NavLink 
                icon={<CogIcon className="w-6 h-6" />}
                label="Settings"
                isActive={view === 'settings'}
                onClick={() => setView('settings')}
            />
        </nav>

        <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center space-x-3 p-2">
                <UserCircleIcon className="w-10 h-10 text-slate-500" />
                <div>
                    <p className="font-semibold text-slate-200">{user.username}</p>
                    <button onClick={onLogout} className="text-xs text-slate-400 hover:text-red-400 flex items-center space-x-1">
                        <LogoutIcon className="w-3 h-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children(view)}
      </main>
    </div>
  );
};

export default DashboardLayout;