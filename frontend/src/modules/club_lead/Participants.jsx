import React from 'react';
import { Download, CheckCircle, Clock } from 'lucide-react';

export default function Participants({ participants = [], onToggleAttendance, onExportCSV }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Export CSV Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Participant Management</h2>
          <p className="text-xs text-slate-500 mt-1">Manage attendance and export participant data to CSV.</p>
        </div>
        <button 
          onClick={onExportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Participant</th>
              <th className="p-4">Event</th>
              <th className="p-4">Ticket</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Attendance</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {participants.length > 0 ? (
              participants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{p.student}</p>
                    <p className="text-xs text-slate-400">{p.studentId}</p>
                  </td>
                  <td className="p-4 text-slate-800 font-semibold">{p.event}</td>
                  <td className="p-4 text-indigo-600 font-bold font-mono text-xs">{p.ticket || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      p.payment === 'approved' || p.payment === 'free' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {p.payment}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">
                    <span className={`inline-flex items-center gap-1 ${p.attendance === 'Checked In' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                      {p.attendance === 'Checked In' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {p.attendance || 'Not Checked In'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onToggleAttendance(p.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                        p.attendance === 'Checked In' 
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' 
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
                      }`}
                    >
                      {p.attendance === 'Checked In' ? 'Undo' : 'Check In'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-16 text-slate-400 text-xs font-medium">
                  কোনো পার্টিসিপেন্ট পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}