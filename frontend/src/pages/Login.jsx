import React, { useState } from 'react';
import { User, Lock, Shield, ArrowRight, UserPlus } from 'lucide-react';
import { MOCK_USERS, authenticateUser } from './authService';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // যেহেতু ব্যাকএন্ড কল করা হচ্ছে, তাই await ব্যবহার করা হয়েছে
    const matchedUser = await authenticateUser(email, password, role);

    if (matchedUser) {
      localStorage.setItem('campusconnect_user', JSON.stringify(matchedUser));
      if (onLoginSuccess) {
        onLoginSuccess(matchedUser);
      }
    } else {
      setError('Invalid Email, Password, or Role combination! (অথবা অ্যাকাউন্টটি এখনো অ্যাপ্রুভ হয়নি)');
    }
  };

  // ডামি ক্রেডেনশিয়াল খুব সহজে সেট করার হেল্পার
  const fillDemoCredentials = (demoRole) => {
    const demo = MOCK_USERS.find(u => u.role === demoRole);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
      setRole(demo.role);
      setError('');
    } else if (demoRole === 'student') {
      // স্টুডেন্টের জন্য রিয়েল ব্যাকএন্ড টেস্ট অ্যাকাউন্ট
      setEmail("student@bup.edu.bd");
      setPassword("123");
      setRole("student");
      setError('');
    }
  };

  // সাইন-আপে যাওয়ার হ্যান্ডলার
  const handleRegisterClick = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      localStorage.setItem('campusconnect_auth_mode', 'register');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">CampusConnect</span>
        </div>
        <h2 className="mt-4 text-center text-xl font-semibold text-slate-600">
          Sign in to your university portal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address / Institutional ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@bup.edu.bd"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
                />
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 font-medium text-slate-800"
              >
                <option value="student">Student Portal</option>
                <option value="admin">Admin Dashboard</option>
                <option value="alumni">Alumni Portal</option>
                <option value="club_lead">Club Leader Portal</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-left flex items-center justify-between transition"
              >
                Student demo <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-left flex items-center justify-between transition"
              >
                Admin demo <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('alumni')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-left flex items-center justify-between transition"
              >
                Alumni demo <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('club_lead')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-left flex items-center justify-between transition"
              >
                Club Leader demo <span>→</span>
              </button>
            </div>
          </div>

          {/* Switch to Register (Sign Up) Section */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Don't have an account yet?
            </p>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold py-2.5 rounded-xl text-xs transition-colors border border-slate-200/60"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create an account (Sign Up)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  ); 
}