import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { fetchUsersList, toggleUserBanStatus } from '../adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // ব্যান/আনব্যান স্ট্যাটাস দিয়ে সর্ট করার ফিল্টার

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await fetchUsersList();
    setUsers(data || []);
    setIsLoading(false);
  };

  // ইউজার ব্যান বা আনব্যান করার হ্যান্ডলার
  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const success = await toggleUserBanStatus(id, newStatus);
    if (success) {
      loadUsers(); // সফল হলে লিস্ট রিফ্রেশ করবে
    } else {
      alert('ইউজারের স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।');
    }
  };

  // সার্চ এবং ফিল্টার লজিক
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500 mt-1">Manage platform access, roles, and account permissions.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={loadUsers}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white font-medium text-gray-700"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Alumni">Alumni</option>
            <option value="Club Lead">Club Lead</option>
            <option value="admin">Admin</option>
          </select>

          {/* Ban/Unban Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white font-medium text-gray-700"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended (Banned)</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 font-semibold uppercase">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500 text-xs">Loading users...</td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.dept}</td>
                  <td className="py-3 px-4 font-medium text-gray-700">{user.role}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'Suspended' ? 'Banned' : user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        user.status === 'Active'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {user.status === 'Active' ? 'Ban User' : 'Unban User'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500 text-xs">কোনো ইউজার পাওয়া যায়নি।</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;