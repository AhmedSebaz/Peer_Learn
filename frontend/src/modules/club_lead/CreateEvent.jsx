import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function CreateEvent({ onEventCreated, onCancel }) {
  const [newEvent, setNewEvent] = useState({
    title: '',
    venue: '',
    date: '',
    time: '',
    deadline: '',
    limit: '',
    fee: '',
    description: '',
    imageFile: null,      // ব্যাকএন্ডে FormData-র জন্য ফাইল অবজেক্ট
    previewImage: null    // ফ্রন্টএন্ডে ইমেজ প্রিভিউ দেখানোর জন্য
  });

  // Upload Event Banner হ্যান্ডলার
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewEvent({ 
        ...newEvent, 
        imageFile: file, 
        previewImage: URL.createObjectURL(file) 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onEventCreated) {
      onEventCreated(newEvent);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Create New Event</h2>
        <p className="text-xs text-slate-500 mt-1">Add the event information and publish it later from Manage Events.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Upload Event Banner Section */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Upload Event Banner</label>
          <div className="flex items-center space-x-4">
            <div className="relative w-36 h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer hover:border-indigo-500 transition">
              {newEvent.previewImage ? (
                <img src={newEvent.previewImage} alt="Event Banner Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-600 transition">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Browse Banner</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">ইভেন্টের ব্যানার ছবি যুক্ত করুন</p>
              <p>প্রস্তাবিত ফরম্যাট: PNG, JPG অথবা WEBP (সর্বোচ্চ ৫ মোবাইট)</p>
              {newEvent.previewImage && (
                <button 
                  type="button" 
                  onClick={() => setNewEvent({ ...newEvent, imageFile: null, previewImage: null })}
                  className="text-red-600 font-bold hover:underline pt-1 inline-block"
                >
                  ছবি রিমুভ করুন
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. AI Innovation Summit"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Venue *</label>
            <input
              type="text"
              required
              placeholder="University Auditorium"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Event Date *</label>
            <input
              type="date"
              required
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Start Time *</label>
            <input
              type="time"
              required
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800"
            />
          </div>

          {/* Registration Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Registration Deadline</label>
            <input
              type="date"
              value={newEvent.deadline}
              onChange={(e) => setNewEvent({ ...newEvent, deadline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800"
            />
          </div>

          {/* Participant Limit */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Participant Limit *</label>
            <input
              type="number"
              required
              placeholder="150"
              value={newEvent.limit}
              onChange={(e) => setNewEvent({ ...newEvent, limit: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Registration Fee */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Registration Fee (BDT)</label>
          <input
            type="number"
            placeholder="0"
            value={newEvent.fee}
            onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Event Description</label>
          <textarea
            rows="4"
            placeholder="Write a short description about the event..."
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 outline-none resize-none text-slate-800 placeholder:text-slate-400"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-100"
          >
            Create Event
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition border border-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}