import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, CheckCircle2, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { fetchJobApplications, updateApplicationStatus } from './alumniService';

export default function ViewApplications({ activeJobId = 1 }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, [activeJobId]);

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // ব্যাকএন্ড নির্দিষ্ট Job ID-এর জন্য আবেদন নিয়ে আসে
      const data = await fetchJobApplications(activeJobId);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching job applications:", err);
      setError(err.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setActionLoadingId(appId);
      // ব্যাকএন্ড ApplicationStatus অনুযায়ী lowercase মান (shortlisted / rejected) পাঠানো হয়
      await updateApplicationStatus(appId, newStatus.toLowerCase());
      
      // UI স্টেট আপডেট
      setApplications(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status: newStatus.toLowerCase() } : app
        )
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="text-sm">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Job Applications & Resumes</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming applications, check resumes, and update applicant statuses.
          </p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-full">
          Total Candidates: {applications.length}
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
          {error}
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
            No applications received yet.
          </div>
        ) : (
          applications.map((app) => {
            const isActing = actionLoadingId === app.id;
            const currentStatus = (app.status || 'pending').toLowerCase();
            const applicantName = app.applicant_name || app.applicantName || "Applicant";
            const applicantEmail = app.applicant_email || "N/A";
            const appliedDate = app.applied_at ? new Date(app.applied_at).toLocaleDateString() : (app.appliedAt || "Recent");
            const cvDownloadUrl = app.resumeDownloadUrl || app.resume_path || "#";

            return (
              <div 
                key={app.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg text-slate-900">{applicantName}</span>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full capitalize ${
                      currentStatus === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      currentStatus === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {currentStatus}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500">
                    <b>Email:</b> {applicantEmail} | <b>Applied on:</b> {appliedDate}
                  </p>
                  
                  {app.cover_letter ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                      "{app.cover_letter}"
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <a 
                    href={cvDownloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>View Resume</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                  </a>

                  {currentStatus !== 'shortlisted' && (
                    <button 
                      disabled={isActing}
                      onClick={() => handleStatusChange(app.id, 'shortlisted')}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Shortlist</span>
                    </button>
                  )}

                  {currentStatus !== 'rejected' && (
                    <button 
                      disabled={isActing}
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}