import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { fetchMentorshipRequests, updateRequestStatus } from './alumniService';

export default function MentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // Load mentorship requests from backend
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMentorshipRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load mentorship requests:", err);
      setError(err.message || "Failed to fetch mentorship requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Accept or Decline mentorship request
  const handleAction = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      await updateRequestStatus(id, newStatus);
      // Update UI state locally upon successful backend update
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-400 space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        <span className="text-sm">Loading mentorship requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-slate-800">Requests from Juniors</h3>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
          Total: {requests.length}
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center border border-slate-100 text-slate-400 text-sm">
          No mentorship requests found.
        </div>
      ) : (
        requests.map((req) => {
          const studentName = req.student_name || "Junior Student";
          const preferredDate = req.preferred_date || "Date not specified";
          const messageText = req.message || "No specific message provided.";
          const status = req.status?.toLowerCase();
          const isActing = actionLoadingId === req.id;

          return (
            <div
              key={req.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                    {studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{studentName}</h4>
                    <p className="text-xs text-slate-500">
                      {req.student_email || "Student"} • Session Request
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Requested for: {preferredDate}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600 flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="italic">"{messageText}"</p>
              </div>

              {status === 'pending' ? (
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    disabled={isActing}
                    onClick={() => handleAction(req.id, 'rejected')}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                  >
                    <UserX className="h-4 w-4" />
                    <span>Decline</span>
                  </button>
                  <button
                    disabled={isActing}
                    onClick={() => handleAction(req.id, 'accepted')}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {isActing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    <span>Accept Session</span>
                  </button>
                </div>
              ) : (
                <div className="text-right">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}