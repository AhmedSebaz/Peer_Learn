import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Calendar, Award, Briefcase, Bell, LogOut, User as UserIcon, Camera, CheckCircle 
} from 'lucide-react';
import AcademicResources from './AcademicResources';
import MentorshipBooking from './MentorshipBooking';
import EventTickets from './EventTickets';
import CareerPortal from './CareerPortal';
import { updateProfile } from './studentService';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(user);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    department: user?.department || 'CSE',
    batch: user?.batch || '',
    bio: user?.bio || '',
    linkedin: user?.linkedin || ''
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState(user?.profile_pic ? `http://127.0.0.1:8000/${user.profile_pic}` : null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const currentUserId = user?.id || user?.user_id || 1;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of CampusConnect?")) {
      if (onLogout) {
        onLogout();
      } else {
        window.location.href = '/login';
      }
    }
  };

  // প্রফাইল পিকচার সার্কেলে ক্লিক করলে ফাইল ইনপুট ট্রিগার করার জন্য
  const handleAvatarClick = () => {
    document.getElementById('hiddenAvatarInput').click();
  };

  const handleAvatarFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setPreviewPic(URL.createObjectURL(file)); // ইনস্ট্যান্ট প্রিভিউ দেখানোর জন্য
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg('');

    const res = await updateProfile(currentUserId, profileData, profilePicFile);
    setIsUpdatingProfile(false);

    if (res.success) {
      setProfileMsg('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      setCurrentUser(prev => ({ ...prev, ...profileData, profile_pic: res.data?.profile_pic || prev?.profile_pic }));
    } else {
      setProfileMsg(res.message || 'প্রোফাইল আপডেট ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-indigo-600 text-white p-2 rounded-xl font-bold text-xl shadow-md shadow-indigo-100">CC</div>
            <h1 className="text-xl font-bold text-gray-900">CampusConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Avatar & Info in Header (Clickable to go to Profile Tab) */}
            <div 
              onClick={() => setActiveTab('profile')} 
              className="flex items-center space-x-2 border-l border-gray-200 pl-4 cursor-pointer group"
              title="Click to view/edit profile"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 bg-indigo-50 flex items-center justify-center shadow-sm">
                {previewPic ? (
                  <img src={previewPic} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-indigo-700 text-sm">{currentUser?.name ? currentUser.name.charAt(0) : 'S'}</span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{currentUser?.name || "MD Istiack"}</p>
                <p className="text-[11px] text-gray-500">{currentUser?.department || "CSE"} • {currentUser?.semester || "Semester 3.2"}</p>
              </div>
            </div>

            {/* Logout Button */}
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

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Home Overview', icon: Home },
            { id: 'resources', label: 'Academic Resources', icon: BookOpen },
            { id: 'mentorship', label: 'Mentorship Slots', icon: Calendar },
            { id: 'events', label: 'Events & Tickets', icon: Award },
            { id: 'career', label: 'Career Opportunities', icon: Briefcase },
            { id: 'profile', label: 'Profile & Settings', icon: UserIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Welcome / Home Overview */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-extrabold mb-2">Welcome Back, {currentUser?.name || "MD Istiack"}! 👋</h1>
              <p className="text-indigo-100 text-sm max-w-2xl">
                Here is what is happening in your campus today. Explore academic resources, connect with alumni mentors, or register for upcoming campus events!
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-opacity-90 transition-all shadow"
                >
                  Browse Resources
                </button>
                <button 
                  onClick={() => setActiveTab('mentorship')}
                  className="bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-800 transition-all border border-indigo-500"
                >
                  Find a Mentor
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase">Current Term</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{currentUser?.semester || "Semester 3.2"}</h3>
                <p className="text-xs text-gray-500 mt-2">B.Sc. in {currentUser?.department || "CSE"} • BUP</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase">Account Status</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1 uppercase">Active</h3>
                <p className="text-xs text-gray-500 mt-2">Verified Student Account</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-purple-600 uppercase">Platform Access</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">Full Access</h3>
                <p className="text-xs text-gray-500 mt-2">Connected to FastAPI Backend</p>
              </div>
            </div>
          </div>
        )}
 
        {/* 2. Academic Resources Tab */}
        {activeTab === 'resources' && <AcademicResources user={currentUser} />}

        {/* 3. Mentorship Tab */}
        {activeTab === 'mentorship' && <MentorshipBooking user={currentUser} />}

        {/* 4. Events Tab */}
        {activeTab === 'events' && <EventTickets user={currentUser} />}

        {/* 5. Career Tab */}
        {activeTab === 'career' && <CareerPortal user={currentUser} />}

        {/* 6. Profile & Settings Tab (With Circle Avatar Click to Upload) */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile & Avatar Settings</h2>

            {profileMsg && (
              <div className="mb-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs p-3 rounded-xl font-medium flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{profileMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Clickable Circle Avatar */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  onClick={handleAvatarClick}
                  className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md cursor-pointer group bg-slate-100 flex items-center justify-center"
                  title="Click to change profile picture"
                >
                  {previewPic ? (
                    <img src={previewPic} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-indigo-600">{currentUser?.name?.charAt(0) || 'S'}</span>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-semibold">Change</span>
                  </div>
                </div>

                {/* Hidden file input */}
                <input 
                  type="file" 
                  id="hiddenAvatarInput" 
                  accept="image/*" 
                  onChange={handleAvatarFileChange} 
                  className="hidden" 
                />
                <p className="text-xs text-gray-400 mt-2">প্রোফাইল পিকচার পরিবর্তন করতে সার্কেলে ক্লিক করুন</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Batch / Semester</label>
                  <input
                    type="text"
                    value={profileData.batch}
                    onChange={(e) => setProfileData({ ...profileData, batch: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Short Bio</label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                <span>{isUpdatingProfile ? 'সংরক্ষণ হচ্ছে...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;