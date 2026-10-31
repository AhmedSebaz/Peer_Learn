import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchSlots, createSlot } from './alumniService';

export default function SlotManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form inputs matching backend schema: available_date, start_time, end_time
  const [availableDate, setAvailableDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Load slots from FastAPI backend
  const loadSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSlots();
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setError(err.message || 'Failed to fetch slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // Submit new slot to backend
  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!availableDate || !startTime || !endTime) return;

    // Backend expects time in "HH:MM:SS" or "HH:MM"
    const payload = {
      available_date: availableDate,
      start_time: startTime.length === 5 ? `${startTime}:00` : startTime,
      end_time: endTime.length === 5 ? `${endTime}:00` : endTime,
    };

    try {
      setSubmitting(true);
      const created = await createSlot(payload);
      setSlots((prev) => [created, ...prev]);

      // Reset form fields
      setAvailableDate('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      alert(`Failed to add slot: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Create Slot Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-indigo-600" />
          <span>Add Availability Slot</span>
        </h3>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleAddSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
            <input
              type="date"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>Publish Slot</span>
            )}
          </button>
        </form>
      </div>

      {/* Slots List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Your Created Slots</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
            Total: {slots.length}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-400 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="text-sm">Loading slots...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-100 text-slate-400 text-sm">
            No availability slots added yet.
          </div>
        ) : (
          slots.map((slot) => {
            const timeDisplay = `${slot.start_time} - ${slot.end_time}`;
            const dateDisplay = slot.available_date;

            return (
              <div
                key={slot.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-800 text-sm">
                      Mentorship Session
                    </span>
                    {slot.is_booked ? (
                      <span className="bg-emerald-50 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Booked</span>
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
                      <span>{dateDisplay}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{timeDisplay}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}