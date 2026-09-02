import React, { useState } from 'react';
import { ShieldAlert, Trash2, CheckCircle, FileText, AlertTriangle, ExternalLink } from 'lucide-react';

const ContentModeration = () => {
  // Mock Flagged Content Data
  const [reports, setReports] = useState([
    {
      id: 'r1',
      title: 'CSE311 Midterm Question Paper 2024',
      type: 'Academic Note',
      uploadedBy: 'Sabbir Ahmed',
      reportedBy: 'Rahat Hasan',
      reason: 'Inaccurate / Copyright Violation',
      date: 'Aug 27, 2026',
      fileUrl: '#'
    },
    {
      id: 'r2',
      title: 'Database Systems Solutions PDF',
      type: 'Study Material',
      uploadedBy: 'Unknown User',
      reportedBy: 'MD Istiack',
      reason: 'Spam / Irrelevant Content',
      date: 'Aug 28, 2026',
      fileUrl: '#'
    }
  ]);

  const handleDismiss = (id) => {
    alert("Report dismissed. Content marked as safe.");
    setReports(reports.filter(r => r.id !== id));
  };

  const handleDeleteContent = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the platform?`)) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Content Moderation</h2>
          <p className="text-xs text-gray-500 mt-1">Review reported notes and community study materials.</p>
        </div>
        <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100">
          {reports.length} Flagged Items
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-40 text-green-500" />
          <p className="font-semibold text-gray-600">All clear!</p>
          <p className="text-xs">No flagged content or reported resources pending for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:border-red-200 transition-all bg-red-50/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {item.type}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Uploaded by: <strong className="text-gray-800">{item.uploadedBy}</strong> • Reported by: <strong className="text-gray-800">{item.reportedBy}</strong></p>
                    <p className="text-red-600 font-medium">Reason: {item.reason}</p>
                  </div>

                  <a 
                    href={item.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inspect File / Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="px-3 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleDeleteContent(item.id, item.title)}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Content</span>
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

export default ContentModeration;