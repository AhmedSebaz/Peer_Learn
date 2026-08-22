import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  Briefcase, 
  Bell, 
  PlusCircle, 
  LogOut, 
  Edit3, 
  Check, 
  X 
} from 'lucide-react';
import SlotManager from './SlotManager';
import MentorshipRequests from './MentorshipRequests';
import PostJobModal from './PostJobModal';

export default function AlumniDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Dynamic Profile State
  const [userProfile, setUserProfile] = useState({
    name: "Alex Morgan",
    role: "Senior Software Engineer",
    batch: "Class of '21",
    department: "CSE"
  });

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({ ...userProfile });

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Siddiqur Rahman requested a mentorship slot.", time: "10 mins ago", unread: true },
    { id: 2, text: "Your job posting for 'Frontend Developer' was approved.", time: "1 hour ago", unread: true },
    { id: 3, text: "Session scheduled with Rahim Ahmed for tomorrow at 4 PM.", time: "1 day ago", unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUserProfile({ ...editForm });
    setIsEditProfileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of PeerLearn?")) {
      alert("Logged out successfully!");
      // Redirect or clear auth session here (e.g., window.location.href = '/login')
    }
  };

  const navItems = [
    { id: 'overview', label: 'Home Overview', icon: Home },
    { id: 'slots', label: 'Slot Manager', icon: Calendar },
    { id: 'requests', label: 'Mentorship Requests', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b border-slate-100 relative">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200">
            PL
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            PeerLearn <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md ml-1">Alumni Portal</span>
          </span>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-6">
          {/* Notification Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-sm text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.unread ? 'bg-indigo-50/60 font-medium text-slate-800' : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      <p>{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Details & Edit Button */}
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {userProfile.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-semibold text-slate-900 leading-none">
                  {userProfile.name}
                </span>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
                  title="Edit Profile"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-500 mt-1">
                {userProfile.role} • {userProfile.batch}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100 ml-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <nav className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            <span>Post Job Opportunity</span>
          </button>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            userName={userProfile.name} 
            setActiveTab={setActiveTab} 
            setIsModalOpen={setIsModalOpen} 
          />
        )}
        {activeTab === 'slots' && <SlotManager />}
        {activeTab === 'requests' && <MentorshipRequests />}
      </main>

      {/* Job Post Modal */}
      <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Edit Profile Information</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Role / Title</label>
                <input 
                  type="text" 
                  value={editForm.role} 
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Graduation Batch</label>
                <input 
                  type="text" 
                  value={editForm.batch} 
                  onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  required 
                />
              </div>
              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditProfileOpen(false)} 
                  className="w-1/2 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-indigo-600 text-white rounded-xl text-xs font-semibold py-2 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ userName, setActiveTab, setIsModalOpen }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 p-8 text-white shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome Back, {userName}! 👋
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Here is what is happening in your varsity alumni community today. Manage your available mentorship slots, process incoming junior requests, or share job opportunities!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('slots')}
              className="flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Available Slot</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-indigo-500/40 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-indigo-500/60 transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              <span>Post a Job / Referral</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">ACTIVE MENTORSHIP SLOTS</span>
            <div className="mt-2 text-2xl font-black text-indigo-600">4 Slots</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Next availability: Tomorrow, 4:00 PM</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">PENDING REQUESTS</span>
            <div className="mt-2 text-2xl font-black text-amber-600">2 Requests</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Needs review & approval</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">TOTAL JUNIORS MENTORED</span>
            <div className="mt-2 text-2xl font-black text-emerald-600">28 Students</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">18 Hours total contributed</p>
        </div>
      </div>
    </div>
  );
}import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  Briefcase, 
  Bell, 
  PlusCircle, 
  LogOut, 
  Edit3, 
  Check, 
  X 
} from 'lucide-react';
import SlotManager from './SlotManager';
import MentorshipRequests from './MentorshipRequests';
import PostJobModal from './PostJobModal';

export default function AlumniDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Dynamic Profile State
  const [userProfile, setUserProfile] = useState({
    name: "Alex Morgan",
    role: "Senior Software Engineer",
    batch: "Class of '21",
    department: "CSE"
  });

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({ ...userProfile });

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Siddiqur Rahman requested a mentorship slot.", time: "10 mins ago", unread: true },
    { id: 2, text: "Your job posting for 'Frontend Developer' was approved.", time: "1 hour ago", unread: true },
    { id: 3, text: "Session scheduled with Rahim Ahmed for tomorrow at 4 PM.", time: "1 day ago", unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUserProfile({ ...editForm });
    setIsEditProfileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of PeerLearn?")) {
      alert("Logged out successfully!");
      // Redirect or clear auth session here (e.g., window.location.href = '/login')
    }
  };

  const navItems = [
    { id: 'overview', label: 'Home Overview', icon: Home },
    { id: 'slots', label: 'Slot Manager', icon: Calendar },
    { id: 'requests', label: 'Mentorship Requests', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Navbar */}
      <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b border-slate-100 relative">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200">
            PL
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            PeerLearn <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md ml-1">Alumni Portal</span>
          </span>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-6">
          {/* Notification Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-sm text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.unread ? 'bg-indigo-50/60 font-medium text-slate-800' : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      <p>{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Details & Edit Button */}
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {userProfile.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-semibold text-slate-900 leading-none">
                  {userProfile.name}
                </span>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
                  title="Edit Profile"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-500 mt-1">
                {userProfile.role} • {userProfile.batch}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100 ml-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="max-w-7xl mx-auto px-8 py-6">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <nav className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            <span>Post Job Opportunity</span>
          </button>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            userName={userProfile.name} 
            setActiveTab={setActiveTab} 
            setIsModalOpen={setIsModalOpen} 
          />
        )}
        {activeTab === 'slots' && <SlotManager />}
        {activeTab === 'requests' && <MentorshipRequests />}
      </main>

      {/* Job Post Modal */}
      <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Edit Profile Information</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Role / Title</label>
                <input 
                  type="text" 
                  value={editForm.role} 
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Graduation Batch</label>
                <input 
                  type="text" 
                  value={editForm.batch} 
                  onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  required 
                />
              </div>
              <div className="flex space-x-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditProfileOpen(false)} 
                  className="w-1/2 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-indigo-600 text-white rounded-xl text-xs font-semibold py-2 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ userName, setActiveTab, setIsModalOpen }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 p-8 text-white shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome Back, {userName}! 👋
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Here is what is happening in your varsity alumni community today. Manage your available mentorship slots, process incoming junior requests, or share job opportunities!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('slots')}
              className="flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Available Slot</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-indigo-500/40 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-indigo-500/60 transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              <span>Post a Job / Referral</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">ACTIVE MENTORSHIP SLOTS</span>
            <div className="mt-2 text-2xl font-black text-indigo-600">4 Slots</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Next availability: Tomorrow, 4:00 PM</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">PENDING REQUESTS</span>
            <div className="mt-2 text-2xl font-black text-amber-600">2 Requests</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">Needs review & approval</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">TOTAL JUNIORS MENTORED</span>
            <div className="mt-2 text-2xl font-black text-emerald-600">28 Students</div>
          </div>
          <p className="mt-4 text-xs font-medium text-slate-500">18 Hours total contributed</p>
        </div>
      </div>
    </div>
  );
}