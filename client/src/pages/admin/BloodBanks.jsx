import { useState, useEffect } from 'react';
import { bloodBankService } from '../../services/bloodBankService';
import { FaBuilding, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminBloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [filter, setFilter] = useState({ isApproved: '', page: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBloodBanks();
  }, [filter]);

  const loadBloodBanks = async () => {
    try {
      const response = await bloodBankService.getBloodBanks(filter);
      setBloodBanks(response.data.bloodBanks || []);
    } catch (error) {
      console.error('Error loading blood banks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bloodBankId) => {
    try {
      await bloodBankService.approveBloodBank(bloodBankId);
      toast.success('Blood bank approved');
      loadBloodBanks();
    } catch (error) {
      toast.error('Failed to approve blood bank');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading blood banks...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Blood Bank Management</h2>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filter.isApproved}
            onChange={(e) => setFilter({ ...filter, isApproved: e.target.value })}
            className="input-field w-48"
          >
            <option value="">All</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </div>

      {/* Blood Banks List */}
      {bloodBanks.length === 0 ? (
        <div className="card text-center py-12">
          <FaBuilding className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No blood banks found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bloodBanks.map((bank) => (
            <div key={bank._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bank.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {bank.isApproved ? 'Approved' : 'Pending'}
                </span>
                <span className="text-sm text-gray-500">{bank.licenseNumber}</span>
              </div>

              <h3 className="font-bold text-lg mb-2">{bank.bankName}</h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>{bank.address.street}</p>
                <p>{bank.address.city}, {bank.address.state}</p>
                <p>{bank.address.zipCode}</p>
                <p className="font-medium">{bank.phone}</p>
                <p>{bank.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600">Donations</p>
                  <p className="font-bold">{bank.totalDonations}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600">Issued</p>
                  <p className="font-bold">{bank.totalIssued}</p>
                </div>
              </div>

              {!bank.isApproved && (
                <button
                  onClick={() => handleApprove(bank._id)}
                  className="btn-primary w-full"
                >
                  <FaCheck className="inline mr-2" />
                  Approve Blood Bank
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBloodBanks;
