import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { FaUsers, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: '', page: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers(filter);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, updates) => {
    try {
      await userService.updateUserStatus(userId, updates);
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'donor': return 'bg-green-100 text-green-800';
      case 'hospital': return 'bg-blue-100 text-blue-800';
      case 'bloodbank': return 'bg-orange-100 text-orange-800';
      case 'financial_donor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">User Management</h2>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
          <select
            value={filter.role}
            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
            className="input-field w-48"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="donor">Donor</option>
            <option value="hospital">Hospital</option>
            <option value="bloodbank">Blood Bank</option>
            <option value="financial_donor">Financial Donor</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="card text-center py-12">
          <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No users found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Verified</th>
                <th className="text-left py-3 px-4 font-semibold">Active</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(user._id, { isVerified: !user.isVerified })}
                        className="text-green-600 hover:text-green-800"
                        title="Toggle Verification"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(user._id, { isActive: !user.isActive })}
                        className={user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                        title="Toggle Active Status"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
