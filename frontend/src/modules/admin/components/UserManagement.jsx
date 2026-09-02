import React, { useState } from 'react';
import { Search, ShieldCheck, UserX, CheckCircle, RefreshCw } from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Mock User Data
  const [users, setUsers] = useState([
    { id: '1', name: 'MD Istiack', email: 'istiack@univ.edu', role: 'Student', status: 'Active', dept: 'CSE' },
    { id: '2', name: 'Sabbir Ahmed', email: 'sabbir@univ.edu', role: 'Alumni', status: 'Active', dept: 'CSE' },
    { id: '3', name: 'Rahat Hasan', email: 'rahat@univ.edu', role: 'Club Lead', status: 'Active', dept: 'EEE' },
    { id: '4', name: 'Azizul Haque', email: 'aziz@univ.edu', role: 'Student', status: 'Suspended', dept: 'BBA' },
  ]);

  const handleStatusToggle = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-xs text-gray-500 mt-1">Manage platform access, roles, and account permissions.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-3">
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
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Alumni">Alumni</option>
            <option value="Club Lead">Club Lead</option>
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </td>
                <td className="py-3 px-4 text-gray-600">{user.dept}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none font-medium text-gray-700 bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Club Lead">Club Lead</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleStatusToggle(user.id)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;