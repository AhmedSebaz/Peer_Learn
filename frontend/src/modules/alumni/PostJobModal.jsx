import React, { useState } from 'react';
import { Briefcase, X, Loader2 } from 'lucide-react';
import { submitJobPosting } from "./alumniService";

export default function PostJobModal({ isOpen, onClose, onJobPosted }) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('full_time');
  const [applicationLink, setApplicationLink] = useState('');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Payload formatted to match backend JobPostCreate schema exactly
    const payload = {
      job_title: jobTitle,
      company_name: companyName,
      location: location,
      job_type: jobType,
      description: description,
      application_link: applicationLink,
    };

    try {
      await submitJobPosting(payload);
      alert('Job opportunity submitted successfully! Pending admin approval.');
      
      // Reset form fields
      setJobTitle('');
      setCompanyName('');
      setLocation('');
      setJobType('full_time');
      setApplicationLink('');
      setDescription('');

      if (onJobPosted) {
        onJobPosted();
      }
      onClose();
    } catch (err) {
      console.error('Failed to post job:', err);
      setError(err.message || 'Failed to submit job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Post Job Opportunity / Referral</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Junior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Brain Station 23"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Remote, Hybrid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none bg-white"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Application Link / Email
              </label>
              <input
                type="text"
                placeholder="e.g. https://company.com/apply or mailto:hr@..."
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
              Description & Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Provide details about the role, required skills, eligibility, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Share Post</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}