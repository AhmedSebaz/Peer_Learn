import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Building, Calendar, Search, CheckCircle, ExternalLink } from 'lucide-react';
import { getCareerJobs } from './studentService';

const CareerPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await getCareerJobs();
    setJobs(data || []);
  };

  const handleApply = (jobId, jobTitle, company) => {
    setAppliedJobs((prev) => ({
      ...prev,
      [jobId]: true
    }));
    alert(`Successfully applied for "${jobTitle}" at ${company}!`);
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
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Type Filters */}
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['All', 'Internship', 'Full-time', 'Part-time'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedType === type
                  ? 'bg-indigo-600 text-white'
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
        {filteredJobs.map((job) => {
          const isApplied = appliedJobs[job.id];
          return (
            <div
              key={job.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-100">
                    {job.type}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
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
                  onClick={() => handleApply(job.id, job.title, job.company)}
                  className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isApplied
                      ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                      : 'bg-gray-900 hover:bg-black text-white shadow-sm'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
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
        })}
      </div>
    </div>
  );
};

export default CareerPortal;