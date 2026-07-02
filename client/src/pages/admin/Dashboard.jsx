import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { FaUsers, FaHospital, FaTint, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await analyticsService.getOverview();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
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
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">System overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Donors</p>
              <p className="text-3xl font-bold text-primary-600">{stats?.totalDonors || 0}</p>
            </div>
            <FaUsers className="text-primary-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Hospitals</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.activeHospitals || 0}</p>
            </div>
            <FaHospital className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blood Available</p>
              <p className="text-3xl font-bold text-green-600">{stats?.bloodAvailable || 0}</p>
            </div>
            <FaTint className="text-green-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Money Raised</p>
              <p className="text-3xl font-bold text-yellow-600">₹{(stats?.moneyRaised || 0).toLocaleString()}</p>
            </div>
            <FaMoneyBillWave className="text-yellow-600 text-3xl" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm">Blood Issued</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.bloodIssued || 0}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Blood Expired</p>
          <p className="text-2xl font-bold text-red-600">{stats?.bloodExpired || 0}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Emergency Requests</p>
          <p className="text-2xl font-bold text-orange-600">{stats?.emergencyRequests || 0}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm">Active Campaigns</p>
          <p className="text-2xl font-bold text-purple-600">{stats?.activeCampaigns || 0}</p>
        </div>
      </div>

      {/* Lives Saved */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-lg">Lives Supported (Estimated)</p>
            <p className="text-4xl font-bold">{stats?.livesSupported || 0}</p>
          </div>
          <FaChartLine className="text-5xl text-primary-200" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
