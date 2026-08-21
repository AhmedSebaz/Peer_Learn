import React, { useState, useEffect } from 'react';
import { Search, Calendar, Star, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { getMentors, bookMentorshipSlot } from './studentService';

const MentorshipBooking = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookedSlots, setBookedSlots] = useState({});

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    const data = await getMentors();
    setMentors(data || []);
  };

  const handleBookSlot = async (mentorId, mentorName, slot) => {
    await bookMentorshipSlot(mentorId, slot);
    
    // Track booked status locally
    setBookedSlots((prev) => ({
      ...prev,
      [`${mentorId}-${slot}`]: true
    }));

    alert(`Successfully booked a slot with ${mentorName} for ${slot}!`);
  };

  // Filter mentors based on search term & category
  const filteredMentors = mentors.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      (m.role && m.role.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            <span>Connect with Alumni & Senior Mentors</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Book 1-on-1 guidance sessions for career advice, code reviews, or interview prep.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by mentor name, company, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Software', 'Data', 'Design'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl border-2 border-indigo-200">
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{mentor.name}</h3>
                    <p className="text-sm font-medium text-gray-600">{mentor.role}</p>
                    <p className="text-xs text-indigo-600 font-semibold">{mentor.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-md text-amber-700 border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold">{mentor.rating || '4.9'}</span>
                </div>
              </div>

              {/* Bio / Description */}
              <p className="text-xs text-gray-500 mt-4 line-clamp-2">
                {mentor.bio || 'Experienced in full-stack development, competitive programming, and system design.'}
              </p>
            </div>

            {/* Slots Section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-700 flex items-center space-x-1 mb-3">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Available Slots Today</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {mentor.slots && mentor.slots.length > 0 ? (
                  mentor.slots.map((slot, idx) => {
                    const isBooked = bookedSlots[`${mentor.id}-${slot}`];
                    return (
                      <button
                        key={idx}
                        disabled={isBooked}
                        onClick={() => handleBookSlot(mentor.id, mentor.name, slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
                          isBooked
                            ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed'
                            : 'bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {isBooked ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Booked</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3 h-3" />
                            <span>{slot}</span>
                          </>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400">No available slots right now.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorshipBooking;