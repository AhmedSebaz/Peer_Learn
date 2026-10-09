import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, CheckCircle, FileText, AlertTriangle, ExternalLink, RefreshCw, Filter, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { fetchFlaggedContent, updateNoteStatus } from '../adminService';

const ContentModeration = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending'); // ডিফল্টভাবে পেন্ডিং নোটগুলো দেখাবে ('pending', 'active', 'rejected', 'ALL')

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    const data = await fetchFlaggedContent();
    setReports(data || []);
    setIsLoading(false);
  };

  // কন্টেন্ট স্ট্যাটাস আপডেট (Approve / Reject / Pending)
  const handleStatusChange = async (id, newStatus) => {
    const success = await updateNoteStatus(id, newStatus);
    if (success) {
      loadContent(); // সফল হলে লিস্ট রিফ্রেশ করবে
    } else {
      alert('কন্টেন্টের স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।');
    }
  };

  // ফিল্টার অনুযায়ী কন্টেন্ট ফিল্টারিং
  const filteredReports = reports.filter(item => {
    if (statusFilter === 'ALL') return true;
    return item.status === statusFilter;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Content Moderation (Notes & Questions)</h2>
          <p className="text-xs text-gray-500 mt-1">Review, approve, or reject student-uploaded study materials and notes. Rejected contents remain visible under filters.</p>
        </div>

        {/* Status Filter & Refresh */}
        <div className="flex items-center space-x-3">
          <button
            onClick={loadContent}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            title="Refresh Content"
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
        <div className="text-center py-12 text-gray-400 text-xs">Loading academic resources...</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-40 text-green-500" />
          <p className="font-semibold text-gray-600">কোনো কন্টেন্ট পাওয়া যায়নি!</p>
          <p className="text-xs">নির্বাচিত ফিল্টারে এই মুহূর্তে কোনো নোট বা কোয়েশ্চেন নেই।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-all bg-gray-50/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {item.type}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'active' ? 'bg-green-100 text-green-700' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'active' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Uploaded by: <strong className="text-gray-800">{item.uploadedBy}</strong> • Date: {item.date}</p>
                    <p className="text-indigo-600 font-medium">Status Note: {item.reason}</p>
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

                {/* Actions: Dynamic based on status */}
                <div className="flex items-center space-x-2 shrink-0">
                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'rejected')}
                      className="flex items-center space-x-1 border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  )}

                  {item.status !== 'active' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'active')}
                      className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{item.status === 'rejected' ? 'Re-Approve' : 'Approve'}</span>
                    </button>
                  )}

                  {item.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'pending')}
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

export default ContentModeration;