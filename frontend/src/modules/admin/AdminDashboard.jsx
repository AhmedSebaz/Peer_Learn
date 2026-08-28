import React, { useState } from 'react';
import { 
  Home, UserCheck, ShieldAlert, Users, Briefcase, Bell, LogOut 
} from 'lucide-react';
import IDVerificationQueue from './components/IDVerificationQueue';
import ContentModeration from './components/ContentModeration';
import UserManagement from './components/UserManagement';
import JobApprovalQueue from './components/JobApprovalQueue';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of Admin Portal?")) {
      if (onLogout) {
        onLogout();
      } else {
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl">CC</div>
            <h1 className="text-xl font-bold text-gray-900">CampusConnect Admin Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden sm:block text-left">
               <p className="text-sm font-medium text-gray-900">Sabbir (Admin)</p>
                <p className="text-xs text-gray-500">{user?.role || "Super Admin"} • Central Office</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100 ml-2"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Home Overview', icon: Home },
            { id: 'verification', label: 'ID Verification Queue', icon: UserCheck },
            { id: 'moderation', label: 'Content Moderation', icon: ShieldAlert },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'job_approvals', label: 'Job Approvals', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-extrabold mb-2">Welcome Back, Sabbir Hossain (Admin)! 🛡️</h1>
              <p className="text-indigo-100 text-sm max-w-2xl">
                System status is normal. Review pending student & alumni ID verifications, moderate flagged community resources, or manage portal permissions.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('verification')}
                  className="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-opacity-90 transition-all shadow"
                >
                  Verify IDs (8 Pending)
                </button>
                <button 
                  onClick={() => setActiveTab('moderation')}
                  className="bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-800 transition-all border border-indigo-500"
                >
                  Review Flagged Content
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase">Total Users</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">1,420</h3>
                <p className="text-xs text-gray-500 mt-2">1,100 Students • 320 Alumni</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-amber-600 uppercase">Pending Verifications</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">8 Requests</h3>
                <p className="text-xs text-gray-500 mt-2">Requires document check</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-red-600 uppercase">Flagged Reports</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">3 Items</h3>
                <p className="text-xs text-gray-500 mt-2">Needs moderation action</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase">Active Events</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">5 Live</h3>
                <p className="text-xs text-gray-500 mt-2">Total 450 tickets sold</p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Component Rendering */}
        {activeTab === 'verification' && <IDVerificationQueue />}
        {activeTab === 'moderation' && <ContentModeration />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'job_approvals' && <JobApprovalQueue />}
      </main>
    </div>
  );
};

export default AdminDashboard;