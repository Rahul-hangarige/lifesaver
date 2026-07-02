import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import { appointmentService } from '../../services/appointmentService';
import { FaTint, FaCalendar, FaAward, FaClock } from 'react-icons/fa';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        donorService.getProfile(),
        appointmentService.getMyAppointments({ status: 'scheduled', limit: 1 })
      ]);

      setStats(profileRes.data);
      setNextAppointment(appointmentsRes.data.appointments[0] || null);
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
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600">Here's your donation overview</p>
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
              <p className="text-gray-600 text-sm">Blood Group</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.bloodGroup || 'N/A'}</p>
            </div>
            <FaTint className="text-gray-400 text-3xl" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className={`text-lg font-bold ${stats?.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.isEligible ? 'Eligible' : 'Not Eligible'}
              </p>
            </div>
            <FaAward className={`${stats?.isEligible ? 'text-green-600' : 'text-red-600'} text-3xl`} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Badges Earned</p>
              <p className="text-3xl font-bold text-primary-600">{stats?.badges?.length || 0}</p>
            </div>
            <FaAward className="text-primary-600 text-3xl" />
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Appointment</h3>
        {nextAppointment ? (
          <div className="flex items-center justify-between bg-primary-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <FaCalendar className="text-primary-600 text-2xl" />
              <div>
                <p className="font-semibold">{new Date(nextAppointment.appointmentDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Time: {nextAppointment.timeSlot}</p>
              </div>
            </div>
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
              Scheduled
            </span>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No upcoming appointments</p>
            <button className="btn-primary mt-4">Book Appointment</button>
          </div>
        )}
      </div>

      {/* Badges */}
      {stats?.badges && stats.badges.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h3>
          <div className="flex flex-wrap gap-4">
            {stats.badges.map((badge, index) => (
              <div key={index} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                {badge.replace(/_/g, ' ').toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Donation */}
      {stats?.lastDonationDate && (
        <div className="card mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Last Donation</h3>
          <div className="flex items-center space-x-4">
            <FaClock className="text-gray-400 text-2xl" />
            <div>
              <p className="font-semibold">{new Date(stats.lastDonationDate).toLocaleDateString()}</p>
              <p className="text-gray-600">
                Next eligible: {new Date(new Date(stats.lastDonationDate).setDate(new Date(stats.lastDonationDate).getDate() + 90)).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
