import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, XCircle, Building2, MapPin, RefreshCw, Filter, RotateCcw } from 'lucide-react';
import { fetchPendingJobs, updateJobStatus } from '../adminService';

const JobApprovalQueue = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending'); // ডিফল্টভাবে পেন্ডিং জবগুলো দেখাবে ('pending', 'active', 'rejected', 'ALL')

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    const data = await fetchPendingJobs();
    setJobs(data || []);
    setIsLoading(false);
  };

  // জব স্ট্যাটাস আপডেট (Approve / Reject)
  const handleStatusChange = async (id, newStatus) => {
    const success = await updateJobStatus(id, newStatus);
    if (success) {
      loadJobs(); // সফল হলে লিস্ট রিফ্রেশ করবে
    } else {
      alert('জবের স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।');
    }
  };

  // ফিল্টার অনুযায়ী জব লিস্ট ফিল্টারিং
  const filteredJobs = jobs.filter(job => {
    if (statusFilter === 'ALL') return true;
    return job.status === statusFilter;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alumni Job Post Moderation</h2>
          <p className="text-xs text-gray-500 mt-1">
            Review, approve, or reject job postings submitted by alumni. Rejected posts remain visible under filters.
          </p>
        </div>

        {/* Status Filter & Refresh */}
        <div className="flex items-center space-x-3">
          <button
            onClick={loadJobs}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            title="Refresh Jobs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center space-x-1.5 bg-gray-50 p-1 border border-gray-200 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-1" />
            {['pending', 'active', 'rejected', 'ALL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'active' ? 'Approved' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-xs">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-gray-600">কোনো জব পোস্ট পাওয়া যায়নি!</p>
          <p className="text-xs">নির্বাচিত ফিল্টারে এই মুহূর্তে কোনো পোস্ট নেই।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-all bg-gray-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      {job.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' :
                      job.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {job.status === 'active' ? 'Approved' : job.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-4 mt-1">
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}
                    </span>
                    <span>Posted by: <strong className="text-gray-700">{job.postedBy}</strong></span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                </div>

                {/* Actions: Dynamic based on status */}
                <div className="flex items-center space-x-2 shrink-0">
                  {job.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'rejected')}
                      className="flex items-center space-x-1 border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  )}

                  {job.status !== 'active' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'active')}
                      className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{job.status === 'rejected' ? 'Re-Approve' : 'Approve'}</span>
                    </button>
                  )}

                  {job.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'pending')}
                      className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                      title="Move back to Pending"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApprovalQueue;