import React from 'react';

export default function Analytics({ events = [] }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Event Analytics</h2>
        <p className="text-xs text-slate-500 mt-1">Monitor registrations, occupancy and revenue.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Registrations</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">4</h3>
          <p className="text-xs text-slate-500 mt-1">All-time registrations</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Verified Revenue</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">৳500</h3>
          <p className="text-xs text-slate-500 mt-1">Approved payments</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Check-in Rate</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">50%</h3>
          <p className="text-xs text-slate-500 mt-1">Overall attendance</p>
        </div>
      </div>

      {/* Event Performance Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900">Event Performance</h3>

        <div className="space-y-6">
          {events.length > 0 ? (
            events.map((ev, index) => (
              <div key={ev.id || index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">{ev.title}</span>
                  <span className="font-semibold text-slate-600 text-xs">
                    {index === 0 ? '1%' : index === 1 ? '2%.' : '0%'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {ev.registrations || 0} registrations • {ev.status === 'Published' ? '1 verified' : '0 verified'} • ৳{ev.fee || 0} revenue
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(index + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              কোনো ইভেন্ট পারফরম্যান্স ডেটা নেই।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}