import React from 'react';

export default function RegistrationParticipants({ registrations = [] }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Event Registrations</h2>
        <p className="text-xs text-slate-500 mt-1">View registered students and their event information.</p>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Student</th>
              <th className="p-4">Student ID</th>
              <th className="p-4">Event</th>
              <th className="p-4">Ticket</th>
              <th className="p-4">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{reg.student}</p>
                    <p className="text-xs text-slate-400">{reg.email}</p>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{reg.studentId}</td>
                  <td className="p-4 text-slate-800 font-semibold">{reg.event}</td>
                  <td className="p-4 text-indigo-600 font-bold">{reg.ticket}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      reg.payment === 'Verified' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {reg.payment}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400 text-xs font-medium">
                  কোনো রেজিস্ট্রেশন পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}