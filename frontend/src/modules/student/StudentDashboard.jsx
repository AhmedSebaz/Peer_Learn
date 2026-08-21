import React, { useState } from 'react';
import { 
  Home, BookOpen, Calendar, Award, Briefcase, Bell 
} from 'lucide-react';
import AcademicResources from './AcademicResources';
import MentorshipBooking from './MentorshipBooking';
import EventTickets from './EventTickets';
import CareerPortal from './CareerPortal';
const StudentDashboard = () => {
  // বাই-ডিফল্ট 'home' সেকশন একটিভ থাকবে
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl">CC</div>
            <h1 className="text-xl font-bold text-gray-900">CampusConnect Student Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold">
                S
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">MD Istiack</p>
                <p className="text-xs text-gray-500">CSE • Semester 3.2</p>
              </div>
            </div>
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

        {/* Dynamic Content Rendering */}

        {/* 1. Welcome / Home Overview */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-extrabold mb-2">Welcome Back, MD Istiack! 👋</h1>
              <p className="text-indigo-100 text-sm max-w-2xl">
                Here is what is happening in your campus today. Explore academic resources, connect with alumni mentors, or register for upcoming campus events!
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('resources')}
                  className="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-opacity-90 transition-all shadow"
                >
                  Browse Resources
                </button>
                <button 
                  onClick={() => setActiveTab('mentorship')}
                  className="bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-800 transition-all border border-indigo-500"
                >
                  Find a Mentor
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase">Current Term</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">Semester 3.2</h3>
                <p className="text-xs text-gray-500 mt-2">B.Sc. in CSE • BUP</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase">Shared Resources</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">12 Files</h3>
                <p className="text-xs text-gray-500 mt-2">Downloaded by 45 students</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-bold text-purple-600 uppercase">Upcoming Events</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">2 Registered</h3>
                <p className="text-xs text-gray-500 mt-2">Next: Hackathon 2026</p>
              </div>
            </div>
          </div>
        )}
 
        {/* 2. Academic Resources Tab */}
        {activeTab === 'resources' && <AcademicResources />}

        {/* 3. Mentorship Tab */}
        {activeTab === 'mentorship' && <MentorshipBooking />}

        {/* 4. Events Tab */}
        {/* 4. Events Tab */}
        {activeTab === 'events' && <EventTickets />}

        {/* 5. Career Tab */}
        {activeTab === 'career' && <CareerPortal />}
      </main>
    </div>
  );
};

export default StudentDashboard;