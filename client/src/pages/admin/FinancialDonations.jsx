import { useState, useEffect } from 'react';
import { donationService } from '../../services/donationService';
import { FaMoneyBillWave } from 'react-icons/fa';

const AdminFinancialDonations = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState({ status: 'completed', page: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const [donationsRes, statsRes] = await Promise.all([
        donationService.getDonations(filter),
        donationService.getStats()
      ]);
      setDonations(donationsRes.data.donations || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading donations...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Financial Donations</h2>

      {/* Stats */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">₹{stats.overall?.totalAmount?.toLocaleString() || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Donations</p>
            <p className="text-3xl font-bold text-blue-600">{stats.overall?.totalDonations || 0}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Average Amount</p>
            <p className="text-3xl font-bold text-yellow-600">₹{Math.round(stats.overall?.averageAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Donations Table */}
      {donations.length === 0 ? (
        <div className="card text-center py-12">
          <FaMoneyBillWave className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No donations found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Donation ID</th>
                <th className="text-left py-3 px-4 font-semibold">Donor Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Campaign</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Badge</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{donation.donationId}</td>
                  <td className="py-3 px-4">{donation.isAnonymous ? 'Anonymous' : donation.donorName}</td>
                  <td className="py-3 px-4">{donation.email}</td>
                  <td className="py-3 px-4 font-bold text-green-600">₹{donation.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">{donation.campaignId?.title || 'General'}</td>
                  <td className="py-3 px-4">{new Date(donation.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {donation.badge?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                    </span>
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

export default AdminFinancialDonations;
