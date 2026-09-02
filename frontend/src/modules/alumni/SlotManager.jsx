
import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function SlotManager() {
  const [slots, setSlots] = useState([
    { id: 1, date: "2026-08-25", time: "10:00 AM - 10:30 AM", topic: "Career Guidance & Resume Review", isBooked: false },
    { id: 2, date: "2026-08-26", time: "04:00 PM - 04:30 PM", topic: "System Design Mock Interview", isBooked: true, bookedBy: "Rahim Ahmed" }
  ]);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!date || !time || !topic) return;

    const newSlot = {
      id: Date.now(),
      date,
      time,
      topic,
      isBooked: false
    };

    setSlots([newSlot, ...slots]);
    setDate('');
    setTime('');
    setTopic('');
  };

  const handleDelete = (id) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create Slot Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-indigo-600" />
          <span>Add Availability Slot</span>
        </h3>
        <form onSubmit={handleAddSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Time Slot</label>
            <input
              type="text"
              placeholder="e.g., 03:00 PM - 03:30 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Topic / Focus</label>
            <input
              type="text"
              placeholder="e.g., Resume Review"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100"
          >
            Publish Slot
          </button>
        </form>
      </div>

      {/* Slots List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Your Created Slots</h3>
        {slots.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-100 text-slate-400 text-sm">
            No availability slots added yet.
          </div>
        ) : (
          slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800 text-sm">{slot.topic}</span>
                  {slot.isBooked ? (
                    <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Booked by {slot.bookedBy}</span>
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      Open
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{slot.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{slot.time}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(slot.id)}
                className="text-slate-400 hover:text-red-500 p-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}