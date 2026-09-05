import React, { useState } from 'react';
import { 
  Home, Calendar, PlusCircle, Settings, Users, CreditCard, 
  UserCheck, BarChart2, QrCode, LogOut 
} from 'lucide-react';
import { 
  getInitialEvents, 
  getInitialRegistrations, 
  getInitialParticipants 
} from './ClubLeadServices';

// আলাদা করা কম্পোনেন্টগুলো ইমপোর্ট করা হলো
import EventCalendar from './EventCalendar';
import CreateEvent from './CreateEvent';
import ManageEvent from './ManageEvent';
import RegistrationParticipants from './RegistrationParticipants';
import Participants from './Participants';
import Analytics from './Analytics';
import QrCheckIn from './QrCheckIn';

export default function ClubLeadDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  // সার্ভিস ফাইল থেকে ডেটা লোড
  const [events, setEvents] = useState(getInitialEvents());
  const [registrations, setRegistrations] = useState(getInitialRegistrations());
  const [participants, setParticipants] = useState(getInitialParticipants());

  // ইভেন্ট ক্রিয়েট হ্যান্ডলার
  const handleEventCreated = (newEventData) => {
    const created = {
      id: events.length + 1,
      title: newEventData.title,
      date: newEventData.date,
      time: newEventData.time,
      venue: newEventData.venue,
      limit: Number(newEventData.limit),
      fee: Number(newEventData.fee),
      status: 'Draft',
      registrations: 0,
      bannerImage: newEventData.previewImage || null
    };
    setEvents([created, ...events]);
    alert('ইভেন্ট সফলভাবে তৈরি হয়েছে এবং ড্রাফট হিসেবে সংরক্ষিত হয়েছে!');
    setActiveTab('manageEvents');
  };

  // ইভেন্ট স্ট্যাটাস পরিবর্তন
  const toggleEventStatus = (id) => {
    setEvents(events.map(ev => {
      if (ev.id === id) {
        return { ...ev, status: ev.status === 'Published' ? 'Draft' : 'Published' };
      }
      return ev;
    }));
  };

  // ইভেন্ট ডিলিট
  const deleteEvent = (id) => {
    if (window.confirm("আপনি কি এই ইভেন্টটি ডিলিট করতে চান?")) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  // উপস্থিতি (Attendance) টগল
  const toggleAttendance = (id) => {
    setParticipants(participants.map(p => {
      if (p.id === id) {
        return { ...p, attendance: p.attendance === 'Checked In' ? 'Not Checked In' : 'Checked In' };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl font-bold text-lg shadow-md">PL</div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Peer-Learn Club Portal</h1>
              <p className="text-xs text-slate-500">Club Event Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Club Lead</p>
              <p className="text-xs text-indigo-600 font-medium">{user?.club_name || "Computer Club"}</p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-3 whitespace-nowrap">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'calendar', label: 'Event Calendar', icon: Calendar },
            { id: 'create', label: 'Create Event', icon: PlusCircle },
            { id: 'manageEvents', label: 'Manage Events', icon: Settings },
            { id: 'registrations', label: 'Registrations', icon: Users },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'participants', label: 'Participants', icon: UserCheck },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            { id: 'checkin', label: 'QR Check-in', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl">
              <p className="text-xs uppercase tracking-wider font-bold text-indigo-200 mb-1">Club Management Center</p>
              <h2 className="text-3xl font-extrabold mb-2">Welcome back, Club Lead!</h2>
              <p className="text-indigo-100 text-sm max-w-2xl mb-6">
                Create university events, track registrations, verify transactions, manage participants and monitor event performance from one dashboard.
              </p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setActiveTab('create')}
                  className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-indigo-50 transition"
                >
                  + Create New Event
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="bg-indigo-700/80 text-white px-5 py-2.5 rounded-xl text-sm font-bold border border-indigo-500 hover:bg-indigo-700 transition"
                >
                  View Analytics
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-indigo-600 uppercase">Total Events</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{events.length}</h3>
                <p className="text-xs text-slate-500 mt-1">Created by your club</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase">Published Events</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{events.filter(e => e.status === 'Published').length}</h3>
                <p className="text-xs text-slate-500 mt-1">Currently visible</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-purple-600 uppercase">Registrations</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">{registrations.length}</h3>
                <p className="text-xs text-slate-500 mt-1">Across all events</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-amber-600 uppercase">Total Revenue</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">৳500</h3>
                <p className="text-xs text-slate-500 mt-1">From verified payments</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. EVENT CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <EventCalendar events={events} onCreateEventClick={() => setActiveTab('create')} />
        )}

        {/* 3. CREATE EVENT TAB */}
        {activeTab === 'create' && (
          <CreateEvent 
            onEventCreated={handleEventCreated} 
            onCancel={() => setActiveTab('overview')} 
          />
        )}

        {/* 4. MANAGE EVENTS TAB */}
        {activeTab === 'manageEvents' && (
          <ManageEvent 
            events={events} 
            onToggleStatus={toggleEventStatus} 
            onDeleteEvent={deleteEvent} 
            onCreateClick={() => setActiveTab('create')} 
          />
        )}

        {/* 5. REGISTRATIONS TAB */}
        {activeTab === 'registrations' && (
          <RegistrationParticipants registrations={registrations} />
        )}

        {/* 6. PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Payment Verification</h2>
              <p className="text-xs text-slate-500">Monitor transaction history and verified payment receipts.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="p-4">Student</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {registrations.map((reg, idx) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{reg.student}</p>
                        <p className="text-xs text-slate-400">{reg.studentId}</p>
                      </td>
                      <td className="p-4 text-slate-800">{reg.event}</td>
                      <td className="p-4 font-bold text-slate-900">৳200</td>
                      <td className="p-4 font-mono text-xs text-indigo-600">TRX98765{idx}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${reg.payment === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {reg.payment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. PARTICIPANTS TAB */}
        {activeTab === 'participants' && (
          <Participants 
            participants={participants} 
            onToggleAttendance={toggleAttendance} 
            onExportCSV={() => alert('Participant list exported to CSV successfully!')} 
          />
        )}

        {/* 8. ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <Analytics events={events} />
        )}

        {/* 9. QR CHECK-IN TAB */}
        {activeTab === 'checkin' && (
          <QrCheckIn onVerifyTicket={(query) => alert(`Ticket/Student ID "${query}" verified and checked-in successfully!`)} />
        )}

      </main>
    </div>
  );
}