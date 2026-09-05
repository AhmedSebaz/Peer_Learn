import React, { useState } from 'react';

export default function QrCheckIn({ onVerifyTicket }) {
  const [query, setQuery] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (onVerifyTicket) {
      onVerifyTicket(query);
    } else {
      alert(`Ticket ID or Student ID "${query}" verified successfully!`);
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
        <div>
          <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Premium Check-in</p>
          <h3 className="text-2xl font-bold mt-1">Verify Event Ticket</h3>
          <p className="text-slate-300 text-xs mt-1">Enter a ticket ID such as PL-102 or a student ID.</p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ticket ID / Student ID"
            className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow"
          >
            Verify Ticket
          </button>
        </form>
      </div>
    </div>
  );
}