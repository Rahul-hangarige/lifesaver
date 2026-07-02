import { useState } from 'react';
import { donorService } from '../../services/donorService';
import { FaUserCheck, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BloodBankVerification = () => {
  const [donorId, setDonorId] = useState('');
  const [donorInfo, setDonorInfo] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!donorId) return;

    try {
      const response = await donorService.getDonorById(donorId);
      setDonorInfo(response.data);
      setSearched(true);
    } catch (error) {
      toast.error('Donor not found');
      setSearched(false);
    }
  };

  const handleUpdateEligibility = async (isEligible) => {
    try {
      await donorService.updateEligibility(donorId, {
        isEligible,
        eligibilityReason: isEligible ? 'Verified by blood bank' : 'Pending medical review'
      });
      toast.success('Eligibility updated');
      setDonorInfo({ ...donorInfo, isEligible });
    } catch (error) {
      toast.error('Failed to update eligibility');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Donor Verification</h2>

      {/* Search Form */}
      <div className="card max-w-2xl mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donor ID
            </label>
            <input
              type="text"
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
              className="input-field"
              placeholder="Enter donor ID"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <FaSearch className="inline mr-2" />
            Search Donor
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && donorInfo && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Donor Information</h3>
            <span className={`px-3 py-1 rounded-full font-medium ${
              donorInfo.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {donorInfo.isEligible ? 'Eligible' : 'Not Eligible'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{donorInfo.userId?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Blood Group:</span>
                <span className="font-bold text-primary-600">{donorInfo.bloodGroup}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{donorInfo.age} years</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{donorInfo.weight} kg</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Total Donations:</span>
                <span className="font-medium">{donorInfo.totalDonations}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Last Donation:</span>
                <span className="font-medium">
                  {donorInfo.lastDonationDate 
                    ? new Date(donorInfo.lastDonationDate).toLocaleDateString() 
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{donorInfo.userId?.phone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{donorInfo.userId?.email}</span>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Medical History</h4>
            <p className="text-gray-600">
              {donorInfo.medicalHistory || 'No medical history recorded'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleUpdateEligibility(true)}
              disabled={donorInfo.isEligible}
              className="btn-primary flex-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <FaUserCheck className="inline mr-2" />
              Mark as Eligible
            </button>
            <button
              onClick={() => handleUpdateEligibility(false)}
              disabled={!donorInfo.isEligible}
              className="btn-secondary flex-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Mark as Ineligible
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankVerification;
