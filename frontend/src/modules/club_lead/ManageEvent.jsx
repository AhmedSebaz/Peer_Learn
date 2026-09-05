import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function ManageEvents({ events = [], onToggleStatus, onDeleteEvent, onCreateClick }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Manage Events</h2>
          <p className="text-xs text-slate-500 mt-1">Publish, unpublish or remove your club events.</p>
        </div>
        <button 
          onClick={onCreateClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Event</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((ev) => (
            <div key={ev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:border-slate-300">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    ev.status === 'Published' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ev.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {ev.date} • {ev.time} • {ev.venue}
                </p>
                <p className="text-xs text-indigo-600 font-semibold pt-1">
                  {ev.registrations || 0} / {ev.limit} registrations • Fee: ৳{ev.fee}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => onToggleStatus(ev.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  {ev.status === 'Published' ? 'Move to Draft' : 'Publish'}
                </button>
                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
            কোনো ইভেন্ট পাওয়া যায়নি। নতুন ইভেন্ট তৈরি করুন।
          </div>
        )}
      </div>
    </div>
  );
}