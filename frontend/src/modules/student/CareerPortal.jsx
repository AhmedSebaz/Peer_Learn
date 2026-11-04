import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, Calendar, Search, CheckCircle, ExternalLink, X, FileText, Upload, Clock, AlertCircle, Info } from 'lucide-react';
import { getCareerJobs, applyForJob, fetchStudentApplications } from './studentService';

const CareerPortal = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [appliedJobsMap, setAppliedJobsMap] = useState({});

  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const userId = user?.id || user?.user_id || 1;
    const [jobsData, appsData] = await Promise.all([
      getCareerJobs(),
      fetchStudentApplications(userId)
    ]);

    setJobs(jobsData || []);
    const appsMap = {};
    if (Array.isArray(appsData)) {
      appsData.forEach(app => {
        appsMap[app.jobId] = app.status;
      });
    }
    setAppliedJobsMap(appsMap);
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJobForApply(job);
    setCoverLetter('');
    setResumeFile(null);
  };

  const handleConfirmApplication = async (e) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    const userId = user?.id || user?.user_id || 1;
    setIsSubmitting(true);

    const response = await applyForJob(
      selectedJobForApply.id,
      userId,
      coverLetter,
      resumeFile
    );

    setIsSubmitting(false);

    if (response && response.success) {
      setAppliedJobsMap((prev) => ({
        ...prev,
        [selectedJobForApply.id]: 'pending'
      }));
      alert(`Successfully applied for "${selectedJobForApply.title}"!`);
      setSelectedJobForApply(null);
      setSelectedJobDetails(null);
    } else {
      alert(response?.message || "Job application failed.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const title = (job.title || job.job_title || '').toLowerCase();
    const company = (job.company || job.company_name || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const type = (job.type || job.job_type || '').toLowerCase();
    const searchLower = (searchTerm || '').toLowerCase();

    const matchesSearch = title.includes(searchLower) || company.includes(searchLower) || location.includes(searchLower);
    const matchesType = selectedType === 'All' || type === (selectedType || '').toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          <span>Career Opportunities & Internships</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Explore exclusive internships and job circulars referred directly by alumni.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search title, company, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none"
          />
        </div>

        <div className="flex space-x-2">
          {['All', 'Internship', 'Full-time', 'Part-time'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${selectedType === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const status = appliedJobsMap[job.id];
          return (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
              <div className="space-y-2">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">{job.type}</span>
                <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                <p className="text-xs text-gray-600">{job.company} • {job.location}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJobDetails(job)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center space-x-1"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Job Details</span>
                </button>

                {status ? (
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                    {status}
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenApplyModal(job)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

     {/* Job Details Modal */}
      {selectedJobDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl space-y-6">
            <button 
              onClick={() => setSelectedJobDetails(null)} 
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg uppercase">
                  {selectedJobDetails.type || 'Full Time'}
                </span>
                <span className="text-xs text-gray-400">
                  Deadline: {selectedJobDetails.deadline || 'N/A'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedJobDetails.title}</h3>
              <p className="text-sm font-semibold text-indigo-600 mt-1 flex items-center space-x-1">
                <span>{selectedJobDetails.company}</span>
                <span>•</span>
                <span className="text-gray-500 font-normal">{selectedJobDetails.location}</span>
              </p>
            </div>

            {/* Alumni Poster Information Box */}
            <div className="bg-gradient-to-r from-indigo-50/60 to-purple-50/60 p-4 rounded-2xl border border-indigo-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
                {(selectedJobDetails.postedBy || 'Alumni').charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Posted By Alumni</p>
                <p className="text-sm font-bold text-gray-900">{selectedJobDetails.postedBy || 'Alumni Partner'}</p>
                <p className="text-xs text-gray-600">{selectedJobDetails.alumniDescription || 'Alumni & Tech Professional'}</p>
              </div>
            </div>

            {/* Job Description & Requirements */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Description & Requirements</h4>
              <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto border border-gray-100">
                {selectedJobDetails.description || 'No description provided.'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setSelectedJobDetails(null)}
                className="w-1/2 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const job = selectedJobDetails;
                  setSelectedJobDetails(null);
                  handleOpenApplyModal(job);
                }}
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-100 flex items-center justify-center space-x-2"
              >
                <span>Apply For Job</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative">
            <button onClick={() => setSelectedJobForApply(null)} className="absolute top-4 right-4 text-gray-400"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold">Apply for {selectedJobForApply.title}</h3>
            <form onSubmit={handleConfirmApplication} className="mt-4 space-y-4">
              <textarea
                rows="3"
                placeholder="Cover letter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
              <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} className="w-full text-xs" />
              <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPortal;