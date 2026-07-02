import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import { requestService } from '../../services/requestService';
import { FaTint, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        hospitalService.getProfile(),
        requestService.getMyRequests({ limit: 5 })
      ]);

      setStats(profileRes.data);
      setRecentRequests(requestsRes.data.requests || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">{stats?.hospitalName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-3xl font-bold text-primary-600">{stats?.totalRequests || 0}</p>
            </div>
            <FaClipboardList className="text-primary-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {recentRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <FaClock className="text-yellow-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {recentRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blood Units</p>
              <p className="text-3xl font-bold text-gray-900">
                {recentRequests.reduce((sum, r) => sum + r.unitsRequired, 0)}
              </p>
            </div>
            <FaTint className="text-gray-400 text-3xl" />
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Blood Requests</h3>
        {recentRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No requests yet. Create your first blood request!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request._id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{request.patientName}</p>
                    <p className="text-gray-600">
                      {request.bloodGroup} - {request.unitsRequired} unit(s)
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(request.requestedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
