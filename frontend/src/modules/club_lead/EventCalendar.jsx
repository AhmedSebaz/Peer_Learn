import React, { useState } from 'react';
import { PlusCircle, Clock, MapPin, Users, Ticket, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function EventCalendar({ events = [], onCreateEventClick }) {
  const monthsList = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // ২০০০ থেকে ২১০০ পর্যন্ত বছরের লিস্ট জেনারেট করা
  const yearsList = Array.from({ length: 101 }, (_, i) => 2000 + i);

  const currentDateObj = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDateObj.getMonth()); // 0 - 11
  const [selectedYear, setSelectedYear] = useState(currentDateObj.getFullYear()); // e.g. 2026
  
  // ডিফল্ট সিলেক্টেড ডেট (YYYY-MM-DD ফরম্যাট)
  const [selectedDate, setSelectedDate] = useState(
    `${currentDateObj.getFullYear()}-${String(currentDateObj.getMonth() + 1).padStart(2, '0')}-${String(currentDateObj.getDate()).padStart(2, '0')}`
  );

  // মাস পরিবর্তন হ্যান্ডলার
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // সিলেক্টेड মাস ও বছরের ক্যালেন্ডার দিনগুলো ক্যালকুলেট করা
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const totalDays = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  // ক্যালেন্ডার গ্রিডের জন্য অ্যারে তৈরি (আগের মাসের কিছু দিন + বর্তমান মাসের দিনগুলো)
  const calendarDays = [];
  
  // আগের মাসের শেষের দিনগুলো দিয়ে প্যাডিং
  const prevMonthDays = getDaysInMonth(selectedYear, selectedMonth === 0 ? 11 : selectedMonth - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const m = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const y = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    calendarDays.push({ day: dayNum, date: dateStr, isCurrentMonth: false });
  }

  // বর্তমান মাসের দিনগুলো
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, date: dateStr, isCurrentMonth: true });
  }

  // পরবর্তী মাসের শুরু দিয়ে গ্রিড পূরণ করা (বাকি ঘরগুলোর জন্য)
  const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingCells; i++) {
    const m = selectedMonth === 11 ? 0 : selectedMonth + 1;
    const y = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, date: dateStr, isCurrentMonth: false });
  }

  // নির্দিষ্ট তারিখে কি ইভেন্ট আছে তা ফিল্টার করার জন্য (backend properties: event_date)
  const selectedDateEvents = events.filter(ev => ev.event_date === selectedDate);
  const currentMonthEvents = events.filter(ev => {
    if (!ev.event_date) return false;
    const [y, m] = ev.event_date.split('-').map(Number);
    return y === selectedYear && m === selectedMonth + 1;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-indigo-200 mb-1">Event Scheduling Center</p>
          <h2 className="text-3xl font-extrabold mb-2">Event Calendar</h2>
          <p className="text-indigo-100 text-sm max-w-xl">
            View all club events by date, monitor schedules and manage upcoming activities from 2000 to 2100.
          </p>
        </div>
        <button 
          onClick={onCreateEventClick}
          className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-indigo-50 transition flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-indigo-600 uppercase">Selected Month</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{currentMonthEvents.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Scheduled events</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase">Published</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{events.filter(e => e.status === 'Published').length}</h3>
          <p className="text-xs text-slate-500 mt-1">Live events</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase">Draft</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{events.filter(e => e.status === 'Draft').length}</h3>
          <p className="text-xs text-slate-500 mt-1">Not published</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-purple-600 uppercase">Selected Date</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedDateEvents.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Events scheduled</p>
        </div>
      </div>

      {/* Main Calendar Section & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Monthly Calendar View */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <h3 className="text-lg font-extrabold text-slate-900">
              Monthly Schedule — {monthsList[selectedMonth]} {selectedYear}
            </h3>

            {/* Month & Year Selectors */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 outline-none text-slate-700"
              >
                {monthsList.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 outline-none text-slate-700"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <div className="flex space-x-1 border-l pl-2 border-slate-200">
                <button onClick={handlePrevMonth} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition">
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition">
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase border-b border-slate-100 pb-3">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, index) => {
              const dayEvents = events.filter(ev => ev.event_date === item.date);
              const isSelected = selectedDate === item.date;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(item.date)}
                  className={`min-h-[85px] p-2 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20' 
                      : item.isCurrentMonth ? 'border-slate-100 bg-slate-50/50 hover:border-slate-300' : 'border-slate-50 bg-slate-100/30 opacity-40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${item.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}`}>
                      {item.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Day Events Indicator */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((ev, i) => (
                      <div key={i} className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold truncate shadow-sm">
                        {ev.start_time || '00:00'} {ev.event_title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Date Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Date</p>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <p className="text-xs text-indigo-600 font-semibold mt-1">{selectedDateEvents.length} event scheduled</p>
          </div>

          <div className="space-y-3 pt-2">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  {/* Banner Image if available */}
                  {ev.banner_url && (
                    <div className="w-full h-28 rounded-xl overflow-hidden border border-slate-200">
                      <img src={`http://localhost:8000${ev.banner_url}`} alt={ev.event_title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-sm">{ev.event_title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ev.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ev.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-600" /> {ev.start_time || 'N/A'}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-600" /> {ev.venue || 'N/A'}</p>
                    <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-600" /> Capacity: {ev.seat_limit}</p>
                    <p className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-indigo-600" /> Fee: ৳{ev.registration_fee}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                এই তারিখে কোনো ইভেন্ট শিডিউল করা নেই।
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}