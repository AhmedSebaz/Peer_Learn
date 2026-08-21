import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Trash2, Download, Search, FileText } from 'lucide-react';
import { getAcademicResources, uploadResource, deleteResource } from './studentService';

const AcademicResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const data = await getAcademicResources();
    setResources(data || []);
  };

  const handleResourceUpload = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCourse) return;

    await uploadResource({
      title: newTitle,
      course: newCourse,
      fileName: selectedFile ? selectedFile.name : 'Document.pdf'
    });

    setNewTitle('');
    setNewCourse('');
    setSelectedFile(null);
    loadResources();
  };

  const handleDeleteResource = async (id) => {
    await deleteResource(id);
    loadResources();
  };

  // Search filter
  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Share Academic Resource</span>
        </h2>
        
        <form onSubmit={handleResourceUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Resource Title (e.g. Algo Notes)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Course Code (e.g. CSE-3201)"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resource</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <p className="text-xs text-gray-500">Showing {filteredResources.length} resources</p>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div key={res.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">
                  {res.course}
                </span>
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">{res.title}</h3>
              <p className="text-xs text-gray-500 mt-1">Uploaded by: {res.uploadedBy || 'Anonymous'}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Download className="w-3.5 h-3.5" />
                <span>{res.downloads || 0} downloads</span>
              </span>
              <button 
                onClick={() => handleDeleteResource(res.id)} 
                className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                title="Delete Resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicResources;