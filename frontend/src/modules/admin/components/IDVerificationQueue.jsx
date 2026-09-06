import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, XCircle, FileText, ExternalLink, Search, RefreshCw } from 'lucide-react';
import { fetchVerificationQueue, handleVerificationAction } from '../adminService';

const IDVerificationQueue = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVerificationQueue();
  }, []);

  const loadVerificationQueue = async () => {
    setIsLoading(true);
    const data = await fetchVerificationQueue();
    setRequests(data || []);
    setIsLoading(false);
  };

  const onActionClick = async (id, name, action) => {
    const confirmMsg = action === 'accept' 
      ? `Are you sure you want to approve identity for ${name}?`
      : `Are you sure you want to reject verification for ${name}?`;

    if (window.confirm(confirmMsg)) {
      const success = await handleVerificationAction(id, action);
      if (success) {
        loadVerificationQueue();
      } else {
        alert('অ্যাকশনটি সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।');
      }
    }
  };

  const filteredRequests = requests.filter(req =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.studentId && req.studentId.includes(searchTerm))
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ID Verification Queue</h2>
          <p className="text-xs text-gray-500 mt-1">
            Review student and alumni submitted credentials to grant verified badges.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadVerificationQueue}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-2 rounded-lg border border-amber-200 shrink-0">
            {requests.length} Pending
          </span>
        </div>
      </div>

      {/* Verification List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-xs">Loading verification queue...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-40" />
          <p className="font-semibold text-gray-600">No pending verification requests!</p>
          <p className="text-xs">All user identity verification requests have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div 
              key={req.id} 
              className="border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-all bg-gray-50/40 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gray-900">{req.name}</h3>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        req.role === 'Student' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {req.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{req.email}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {req.submittedDate}
                  </span>
                </div>

                {/* Details Meta */}
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-gray-100 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-semibold uppercase">Department</span>
                    <span className="font-semibold text-gray-800">{req.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-semibold uppercase">
                      {req.role === 'Student' ? 'Student ID' : 'Details'}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {req.studentId}
                    </span>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center bg-white">
                  <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-700">Submitted ID Document / Card</p>
                  <a 
                    href={req.documentUrl?.startsWith('http') ? req.documentUrl : `http://127.0.0.1:8000/${req.documentUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] text-indigo-600 hover:underline font-medium mt-1"
                  >
                    <span>View full resolution document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onActionClick(req.id, req.name, 'reject')}
                  className="flex-1 flex items-center justify-center space-x-1.5 border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => onActionClick(req.id, req.name, 'accept')}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IDVerificationQueue;