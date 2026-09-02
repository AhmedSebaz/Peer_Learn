import React, { useState } from 'react';
import { Briefcase, CheckCircle2, XCircle, Building2, MapPin } from 'lucide-react';

const JobApprovalQueue = () => {
  // Mock Pending Jobs Data
  const [jobs, setJobs] = useState([
    {
      id: 'j1',
      title: 'Software Engineer (Frontend)',
      company: 'Brain Station 23',
      postedBy: 'Sabbir Ahmed (Alumni)',
      location: 'Dhaka (Hybrid)',
      type: 'Full-time',
      date: 'Aug 26, 2026',
      description: 'Looking for a React developer with knowledge of modern state management.'
    },
    {
      id: 'j2',
      title: 'SQA Intern',
      company: 'Therap BD',
      postedBy: 'Azizul Haque (Alumni)',
      location: 'Remote',
      type: 'Internship',
      date: 'Aug 27, 2026',
      description: 'Paid internship for CSE final semester students with basic automation knowledge.'
    }
  ]);

  const handleApprove = (id) => {
    alert("Job Approved and published to Career Portal!");
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleReject = (id) => {
    if(window.confirm("Are you sure you want to reject this job posting?")) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alumni Job Approvals</h2>
          <p className="text-xs text-gray-500 mt-1">
            Review job postings submitted by alumni before they appear on Career Opportunities.
          </p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-100">
          {jobs.length} Pending Approval
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-gray-600">No pending job approvals!</p>
          <p className="text-xs">All submitted postings have been moderated.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-all bg-gray-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      {job.type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
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

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleReject(job.id)}
                    className="flex items-center space-x-1 border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
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