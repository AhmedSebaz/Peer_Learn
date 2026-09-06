import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { fetchJobApplications, updateApplicationStatus } from './alumniService';

export default function ViewApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchJobApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching job applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    const res = await updateApplicationStatus(appId, newStatus);
    if (res && res.success) {
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-500">Loading applications...</div>;
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
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500">
            No applications received yet.
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg text-slate-900">{app.applicantName}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    app.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-600">
                  Applied for: {app.jobTitle} at {app.company}
                </p>
                <p className="text-xs text-slate-500">
                  <b>Department:</b> {app.department} | <b>Student ID:</b> {app.studentId} | <b>Applied on:</b> {app.appliedAt}
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                  "{app.coverLetter}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <a 
                  href={app.resumePath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>View Resume</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                </a>

                {app.status !== 'Shortlisted' && (
                  <button 
                    onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                    className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shortlist</span>
                  </button>
                )}

                {app.status !== 'Rejected' && (
                  <button 
                    onClick={() => handleStatusChange(app.id, 'Rejected')}
                    className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}