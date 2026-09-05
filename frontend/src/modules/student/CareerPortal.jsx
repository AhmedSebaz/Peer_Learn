import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, Calendar, Search, CheckCircle, ExternalLink, X, FileText, Upload } from 'lucide-react';
import { getCareerJobs, applyForJob } from './studentService';

const CareerPortal = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState({});

  // Application Modal States
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await getCareerJobs();
    setJobs(data || []);
  };

  // Trigger when clicking Apply Now
  const handleOpenApplyModal = (job) => {
    setSelectedJobForApply(job);
    setCoverLetter('');
    setResumeFile(null);
  };

  // Submit application form to Backend
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
      setAppliedJobs((prev) => ({
        ...prev,
        [selectedJobForApply.id]: true
      }));
      alert(`Successfully applied for "${selectedJobForApply.title}" at ${selectedJobForApply.company}!`);
      setSelectedJobForApply(null);
    } else {
      alert(response?.message || "Job application failed. Please try again.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'All' || job.type.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Career Opportunities & Internships</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore exclusive internships and job circulars referred directly by alumni and partner tech companies.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search title, company, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Type Filters */}
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Internship', 'Full-time', 'Part-time'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isApplied = appliedJobs[job.id];
            return (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                      {job.type}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {job.deadline}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center space-x-1 font-medium">
                      <Building className="w-3.5 h-3.5 text-gray-400" />
                      <span>{job.company}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{job.location}</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 pt-1 line-clamp-2">{job.description}</p>
                </div>

                <div className="w-full md:w-auto flex-shrink-0">
                  <button
                    disabled={isApplied}
                    onClick={() => handleOpenApplyModal(job)}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      isApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Application Sent</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">কোনো জব অপরচুনিটি পাওয়া যায়নি।</p>
          </div>
        )}
      </div>

      {/* Job Application Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setSelectedJobForApply(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-1">
              <FileText className="w-5 h-5" />
              <span>Job Application</span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{selectedJobForApply.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Company: <span className="text-gray-800 font-semibold">{selectedJobForApply.company}</span>
            </p>

            <form onSubmit={handleConfirmApplication} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Cover Letter / Note to Recruiter</label>
                <textarea
                  rows="4"
                  placeholder="Briefly describe why you are a good fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Upload Resume (PDF)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <Upload className="w-6 h-6 text-indigo-600" />
                    <p className="text-xs text-gray-600 font-medium">
                      {resumeFile ? resumeFile.name : "Click to upload resume or drag and drop"}
                    </p>
                    <p className="text-[10px] text-gray-400">PDF, DOC up to 5MB</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl text-sm transition-colors mt-2 shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPortal;