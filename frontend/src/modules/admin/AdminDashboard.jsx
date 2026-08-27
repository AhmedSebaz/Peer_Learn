import React from 'react';
import { Shield, Clock, LogOut, Construction } from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CampusConnect</h1>
            <p className="text-xs text-slate-400">Admin Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200">{user?.name || 'System Admin'}</p>
            <p className="text-xs text-blue-400 capitalize">{user?.role || 'admin'}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition duration-150 border border-red-500/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area - Coming Soon */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 text-center">
        <div className="bg-slate-800/60 border border-slate-700 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full backdrop-blur-md">
          <div className="bg-blue-600/20 text-blue-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <Construction className="w-8 h-8 animate-pulse" />
          </div>
          
          <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">
            Under Development
          </span>

          <h2 className="text-3xl font-extrabold text-white mt-4 mb-2">
            Admin Dashboard is Coming Soon!
          </h2>
          
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            We are currently building powerful management tools, user verification pipelines, and system analytics for administrators. Stay tuned!
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-900/50 py-3 px-4 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Expected Release: Sprint 3 Milestone</span>
          </div>
        </div>
      </main>
    </div>
  );
}