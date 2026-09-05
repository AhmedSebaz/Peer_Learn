import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, Briefcase, Award, BookOpen, Link as LinkIcon, FileText, Upload } from 'lucide-react';
import { registerUser } from './authService';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', 
    department: 'CSE',
    batch: '',
    roleTitle: '', 
    clubName: 'BUP Computer Club', 
    semester: '3.2', 
    linkedin: '',
    bio: '',
    idCardFile: null 
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        idCardFile: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('দয়া করে সব প্রয়োজনীয় ফিল্ড পূরণ করুন।');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড দুটি মিলছে না! অনুগ্রহ করে আবার চেক করুন।');
      return;
    }

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (!formData.idCardFile) {
      setError('অনুগ্রহ করে আইডি কার্ড বা ডকুমেন্ট ফাইল আপলোড করুন।');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      
      const backendRole = formData.role === 'club_admin' ? 'club_lead' : formData.role;
      data.append('role', backendRole);

      if (backendRole === 'student') {
        data.append('department', formData.department);
        data.append('batch', `Semester ${formData.semester}`);
        data.append('semester', formData.semester);
      } else if (backendRole === 'alumni') {
        data.append('role_title', formData.roleTitle);
        data.append('batch', formData.batch);
      } else if (backendRole === 'club_lead') {
        data.append('club_name', formData.clubName);
        data.append('role_title', `Lead @ ${formData.clubName}`);
      }

      if (formData.linkedin) {
        data.append('linkedin', formData.linkedin);
      }
      if (formData.bio) {
        data.append('bio', formData.bio);
      }
      
      if (formData.idCardFile) {
        data.append('id_card', formData.idCardFile);
      }

      const result = await registerUser(data);
      
      if (result.success) {
        alert('রেজিস্ট্রেশন সফল হয়েছে! অ্যাকাউন্টটি এডমিন কর্তৃক অনুমোদিত হওয়ার পর লগইন করতে পারবেন।');
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      } else {
        // এরর মেসেজটি অবজেক্ট বা অ্যারে হলে সেটিকে স্ট্রিং বানিয়ে দেখানো যাতে ক্র্যাশ না করে
        let msg = result.message;
        if (typeof msg === 'object') {
          msg = JSON.stringify(msg);
        }
        setError(msg || 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি।');
      }
    } catch (err) {
      console.error("Registration Exception:", err);
      setError('সার্ভারে সংযোগ স্থাপন করা যায়নি। ব্যাকএন্ড সার্ভার চালু আছে কি না চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white text-xl shadow-lg shadow-indigo-200">
            CC
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-black tracking-tight text-slate-900">
          Create a CampusConnect Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Join your varsity peer mentorship and career network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-100 rounded-3xl border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl font-medium text-center break-words">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.role === 'student'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'alumni' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.role === 'alumni'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Alumni
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'club_admin' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.role === 'club_admin'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Club Admin
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="MD Istiack Ahmed"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@bup.edu.bd"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Conditional Fields based on Role */}
            {formData.role === 'alumni' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Current Job Role / Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="roleTitle"
                      required
                      value={formData.roleTitle}
                      onChange={handleChange}
                      placeholder="Software Engineer @ Tech Co."
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Graduation Batch</label>
                  <input
                    type="text"
                    name="batch"
                    required
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="Class of '23"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </>
            ) : formData.role === 'club_admin' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Select Club Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <select
                    name="clubName"
                    value={formData.clubName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="BUP Computer Club">BUP Computer Club</option>
                    <option value="IEEE BUP SB">IEEE BUP SB</option>
                    <option value="BUP IT Society">BUP IT Society</option>
                    <option value="BUP Career Club">BUP Career Club</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ICT">ICT</option>
                    <option value="BBA">BBA</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Semester</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="text"
                      name="semester"
                      required
                      value={formData.semester}
                      onChange={handleChange}
                      placeholder="3.2"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ID Card / Verification Document Upload Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                {formData.role === 'alumni' ? 'Alumni Certificate / ID Proof' : 'Student ID Card Image'}
              </label>
              <div className="relative flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-500 transition-colors bg-slate-50/50">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Upload className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-medium truncate max-w-[200px]">
                    {formData.idCardFile ? formData.idCardFile.name : 'Upload ID Card (PNG, JPG, PDF)'}
                  </span>
                </div>
                <input
                  type="file"
                  required
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">This will be verified by the admin before account activation.</p>
            </div>

            {/* Extra Professional Details (LinkedIn & Short Bio) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">LinkedIn Profile Link (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Short Bio / Introduction (Optional)</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                  <FileText className="h-4 w-4" />
                </div>
                <textarea
                  name="bio"
                  rows="2"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a few words about yourself..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}