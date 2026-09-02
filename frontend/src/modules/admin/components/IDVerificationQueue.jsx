import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, FileText, ExternalLink, Search } from 'lucide-react';

const IDVerificationQueue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Pending Verification Requests Data
  const [requests, setRequests] = useState([
    {
      id: 'v1',
      name: 'Tanvir Hossain',
      email: 'tanvir.cse@univ.edu',
      role: 'Student',
      department: 'CSE',
      studentId: '2021-1-60-045',
      submittedDate: 'Aug 28, 2026',
      documentUrl: '#',
      idCardImage: 'https://via.placeholder.com/300x180?text=Student+ID+Card'
    },
    {
      id: 'v2',
      name: 'Nusrat Jahan',
      email: 'nusrat.alumni@gmail.com',
      role: 'Alumni',
      department: 'EEE',
      graduationYear: '2023',
      submittedDate: 'Aug 27, 2026',
      documentUrl: '#',
      idCardImage: 'https://via.placeholder.com/300x180?text=Certificate/ID+Copy'
    }
  ]);

  const handleApprove = (id, name) => {
    alert(`Successfully verified identity for ${name}!`);
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleReject = (id, name) => {
    if (window.confirm(`Are you sure you want to reject verification for ${name}?`)) {
      setRequests(requests.filter(req => req.id !== id));
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
      {filteredRequests.length === 0 ? (
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
                      {req.role === 'Student' ? 'Student ID' : 'Graduation Year'}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {req.role === 'Student' ? req.studentId : req.graduationYear}
                    </span>
                  </div>
                </div>

                {/* Document Preview Placeholder */}
                <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center bg-white">
                  <FileText className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-700">Submitted ID Document / Card</p>
                  <a 
                    href={req.documentUrl} 
                    target="_blank" 
                    rel="noreferrer"
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
                  onClick={() => handleReject(req.id, req.name)}
                  className="flex-1 flex items-center justify-center space-x-1.5 border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.name)}
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