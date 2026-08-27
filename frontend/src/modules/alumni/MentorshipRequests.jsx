
import React, { useState } from 'react';
import { UserCheck, UserX, Clock, MessageSquare } from 'lucide-react';

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([
    { id: 101, studentName: "Siddiqur Rahman", semester: "Semester 3.2", topic: "Frontend Development Roadmaps", message: "Hi! I want to learn more about transitioning into React and Tailwind.", date: "Aug 24, 2026", status: "pending" },
    { id: 102, studentName: "Anika Chowdhury", semester: "Semester 4.1", topic: "Job Referral & Portfolio Review", message: "Looking for feedback on my full-stack project portfolio.", date: "Aug 26, 2026", status: "pending" }
  ]);

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Pending Requests from Juniors</h3>
      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center border border-slate-100 text-slate-400 text-sm">
          No pending mentorship requests.
        </div>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                  {req.studentName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{req.studentName}</h4>
                  <p className="text-xs text-slate-500">{req.semester} • Session: <span className="text-indigo-600 font-medium">{req.topic}</span></p>
                </div>
              </div>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Requested for {req.date}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600 flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="italic">"{req.message}"</p>
            </div>

            {req.status === 'pending' ? (
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => handleAction(req.id, 'rejected')}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <UserX className="h-4 w-4" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={() => handleAction(req.id, 'accepted')}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-colors"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Accept Session</span>
                </button>
              </div>
            ) : (
              <div className="text-right">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${req.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {req.status === 'accepted' ? 'Accepted' : 'Declined'}
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}