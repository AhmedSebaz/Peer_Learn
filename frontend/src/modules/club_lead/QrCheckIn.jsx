import React, { useState } from 'react';
import { QrCode, CheckCircle2, Search } from 'lucide-react';

export default function QrCheckIn({ onVerifyTicket }) {
  const [query, setQuery] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (onVerifyTicket && query.trim()) {
      onVerifyTicket(query.trim());
    }
    setQuery('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Smart Ticket Check-in</h2>
        <p className="text-xs text-slate-500 mt-1">Search by Ticket ID or Student ID and instantly verify participants.</p>
      </div>

      {/* Check-in Card */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600/30 p-3 rounded-2xl border border-indigo-500/30">
            <QrCode className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Premium Check-in</p>
            <h3 className="text-2xl font-bold mt-0.5">Verify Event Ticket</h3>
          </div>
        </div>
        
        <p className="text-slate-300 text-xs">
          ইভেন্টে অংশগ্রহণকারীর ইউনিক টিকেট নম্বর (যেমন: PL-101) অথবা স্টুডেন্ট আইডি লিখে ভেরিফাই করুন। চেক-ইন করার সাথে সাথে উপস্থিতি আপডেট হয়ে যাবে।
        </p>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Ticket ID or Student ID..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold outline-none placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-md shadow-indigo-600/30 shrink-0 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify Ticket</span>
          </button>
        </form>
      </div>
    </div>
  );
}