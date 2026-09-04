import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Trash2, Download, Search, FileText, Filter, Star } from 'lucide-react';
import { getAcademicResources, uploadResource, deleteResource } from './studentService';

const AcademicResources = ({ user }) => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('ALL'); // 'ALL', 'NOTES', 'QUESTION', 'MY_RESOURCES'
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newNoteType, setNewNoteType] = useState('NOTES'); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Delete Confirmation Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const currentUserId = user?.id || user?.user_id || 1;

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const data = await getAcademicResources();
    setResources(data || []);
  };

  const handleResourceUpload = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCourse || !selectedFile) {
      alert('দয়া করে সব প্রয়োজনীয় ফিল্ড পূরণ করুন এবং ফাইল সিলেক্ট করুন।');
      return;
    }

    setIsUploading(true);

    const response = await uploadResource({
      title: newTitle,
      course_code: newCourse,
      department: user?.department || 'CSE',
      note_type: newNoteType, 
      description: 'Uploaded via CampusConnect Portal',
      file: selectedFile
    }, currentUserId);

    setIsUploading(false);

    if (response && response.success) {
      setNewTitle('');
      setNewCourse('');
      setNewNoteType('NOTES');
      setSelectedFile(null);
      alert('Resource uploaded successfully! Pending admin approval.');
      loadResources();
    } else {
      alert(response?.message || 'Failed to upload resource. Please try again.');
    }
  };

  // ডিলিট পপআপ ওপেন করা
  const openDeleteModal = (id) => {
    setResourceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // কনফার্ম করার পর ডিলিট রিকোয়েস্ট পাঠানো
  const confirmDeleteResource = async () => {
    if (!resourceToDelete) return;

    const success = await deleteResource(resourceToDelete);
    if (success) {
      setIsDeleteModalOpen(false);
      setResourceToDelete(null);
      loadResources();
    } else {
      alert('Failed to delete resource.');
    }
  };

  // Search & Tab filter
  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.course?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (selectedTab === 'MY_RESOURCES') {
      return matchesSearch && (res.user_id === currentUserId || res.userId === currentUserId);
    } else if (selectedTab === 'NOTES') {
      return matchesSearch && res.note_type === 'NOTES' && res.status !== 'pending';
    } else if (selectedTab === 'QUESTION') {
      return matchesSearch && (res.note_type === 'QUESTION' || res.note_type === 'QUESTIONS') && res.status !== 'pending';
    } else {
      // ALL active resources (hide pending ones for regular users unless it's their own in MY_RESOURCES)
      return matchesSearch && res.status !== 'pending';
    }
  });

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Share Academic Resource</span>
        </h2>
        
        <form onSubmit={handleResourceUpload} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Resource Title (e.g. Algo Notes)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Course Code (e.g. CSE-3201)"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <select
            value={newNoteType}
            onChange={(e) => setNewNoteType(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="NOTES">Notes</option>
            <option value="QUESTION">Question</option>
          </select>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="px-2 py-2 border border-gray-300 rounded-xl text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 md:col-span-5 lg:col-span-1 shadow-sm shadow-indigo-100"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Filter Tabs including My Resources */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-gray-400 mr-1 hidden sm:block" />
          {['ALL', 'NOTES', 'QUESTION', 'MY_RESOURCES'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedTab === tab 
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'MY_RESOURCES' ? '📂 My Resources' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <p className="text-xs text-gray-500">Showing {filteredResources.length} resources</p>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const isMyResource = res.user_id === currentUserId || res.userId === currentUserId;
            const isPending = res.status === 'pending';

            return (
              <div key={res.id} className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                        {res.course_code || res.course}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        isPending 
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : res.note_type === 'QUESTION' || res.note_type === 'QUESTIONS' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isPending ? '⏳ Pending Approval' : (res.note_type === 'QUESTION' || res.note_type === 'QUESTIONS' ? 'QUESTION' : 'NOTES')}
                      </span>
                    </div>
                    
                    {/* Average Rating Display */}
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{Number(res.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base">{res.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Uploaded by: {isMyResource ? 'You' : (res.uploadedBy || 'MD Istiack')}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>{res.downloads || 0} downloads</span>
                  </span>
                  
                  {/* Delete button (Only for own resource or admin) */}
                  {(isMyResource || user?.role === 'admin') && (
                    <button 
                      onClick={() => openDeleteModal(res.id)} 
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">কোনো রিসোর্স পাওয়া যায়নি।</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">ডিলিট নিশ্চিত করুন</h3>
            <p className="text-xs text-gray-500">আপনি কি নিশ্চিতভাবে এই রিসোর্সটি মুছে ফেলতে চান? একবার ডিলিট করলে এটি আর ফিরে পাবেন না।</p>
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                বাতিল
              </button>
              <button 
                onClick={confirmDeleteResource} 
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm shadow-red-100"
              >
                ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicResources;