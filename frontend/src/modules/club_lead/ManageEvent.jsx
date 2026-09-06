import React, { useState } from 'react';
import { PlusCircle, Filter, Trash2, Globe, FileText, Clock, MapPin, Users, Ticket } from 'lucide-react';

export default function ManageEvents({ events = [], onToggleStatus, onDeleteEvent, onCreateClick }) {
  const [filterStatus, setFilterStatus] = useState('All');

  // ফিল্টারিং লজিক (All, Published, Draft)
  const filteredEvents = events.filter(ev => {
    if (filterStatus === 'All') return true;
    return ev.status === filterStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Filters / Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Manage Events</h2>
          <p className="text-xs text-slate-500 mt-1">Publish, unpublish or remove your club events, and sort them easily.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter Dropdown */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft (Pending)</option>
            </select>
          </div>

          <button 
            onClick={onCreateClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => (
            <div key={ev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-slate-300">
              
              <div className="flex items-start gap-4">
                {/* Event Banner Thumbnail */}
                {ev.banner_url ? (
                  <img 
                    src={`http://localhost:8000${ev.banner_url}`} 
                    alt={ev.event_title} 
                    className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                  />
                ) : (
                  <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0">
                    No Image
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-900">{ev.event_title}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ev.status === 'Published' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500" /> {ev.event_date} • {ev.start_time || 'N/A'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500" /> {ev.venue || 'N/A'}</span>
                  </p>

                  <p className="text-xs text-indigo-600 font-semibold pt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Limit: {ev.seat_limit}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Ticket className="w-3.5 h-3.5" /> Fee: ৳{ev.registration_fee}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons (Publish/Draft & Delete) */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={() => onToggleStatus(ev.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    ev.status === 'Published' 
                      ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' 
                      : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {ev.status === 'Published' ? 'Move to Draft' : 'Publish'}
                </button>
                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
            কোনো ইভেন্ট পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}