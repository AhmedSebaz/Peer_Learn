import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, Calendar, Trash2, Loader2, Users } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function MyJobs({ onViewApplicants }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/alumni/jobs`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      setDeletingId(jobId);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/alumni/jobs/${jobId}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } else {
        alert("Failed to delete job.");
      }
    } catch (err) {
      alert("Error deleting job.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>My Posted Jobs</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage all job opportunities and referrals you have shared.</p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-full">
          Total Posts: {jobs.length}
        </span>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border text-slate-500">
            You haven't posted any jobs yet.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2 flex-1">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg uppercase">
                  {job.job_type}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{job.job_title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center space-x-1 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company_name}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => onViewApplicants(job.id)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>View Applicants</span>
                </button>

                <button
                  disabled={deletingId === job.id}
                  onClick={() => handleDelete(job.id)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {deletingId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}