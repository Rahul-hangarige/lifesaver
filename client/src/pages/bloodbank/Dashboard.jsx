import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bloodBankService } from '../../services/bloodBankService';
import { bloodService } from '../../services/bloodService';
import { appointmentService } from '../../services/appointmentService';
import { FaTint, FaCalendar, FaBox, FaExclamationTriangle } from 'react-icons/fa';

const BloodBankDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [expiringBags, setExpiringBags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, appointmentsRes, expiringRes, summaryRes] = await Promise.all([
        bloodBankService.getProfile(),
        appointmentService.getBloodBankAppointments({ date: new Date().toISOString().split('T')[0] }),
        bloodService.getExpiringBags(),
        bloodService.getSummary()
      ]);

      setStats(profileRes.data);
      setTodayAppointments(appointmentsRes.data.appointments || []);
      setExpiringBags(expiringRes.data || []);
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
        <p className="text-gray-600">{stats?.bankName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Donations</p>
              <p className="text-3xl font-bold text-primary-600">{stats?.totalDonations || 0}</p>
            </div>
            <FaTint className="text-primary-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blood Issued</p>
              <p className="text-3xl font-bold text-green-600">{stats?.totalIssued || 0}</p>
            </div>
            <FaBox className="text-green-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Appointments</p>
              <p className="text-3xl font-bold text-blue-600">{todayAppointments.length}</p>
            </div>
            <FaCalendar className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
              <p className="text-3xl font-bold text-red-600">{expiringBags.length}</p>
            </div>
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Appointments</h3>
        {todayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                <div>
                  <p className="font-semibold">{appointment.donorId?.userId?.name}</p>
                  <p className="text-gray-600">{appointment.timeSlot} • {appointment.donorId?.bloodGroup}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expiring Blood Bags */}
      {expiringBags.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <h3 className="text-xl font-bold text-red-800 mb-4">Expiring Blood Bags</h3>
          <div className="space-y-2">
            {expiringBags.map((bag) => (
              <div key={bag._id} className="flex items-center justify-between">
                <div>
                  <span className="font-bold">{bag.bloodGroup}</span>
                  <span className="text-gray-600 ml-2">Expires: {new Date(bag.expiryDate).toLocaleDateString()}</span>
                </div>
                <span className="text-sm text-gray-600">{bag.component}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankDashboard;
