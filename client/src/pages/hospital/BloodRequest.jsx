import { useState } from 'react';
import { requestService } from '../../services/requestService';
import { FaTint, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const HospitalBloodRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsRequired: 1,
    emergencyLevel: 'medium',
    contactNumber: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const emergencyLevels = ['low', 'medium', 'high', 'critical'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.bloodGroup || !formData.contactNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await requestService.createRequest(formData);
      toast.success('Blood request submitted successfully');
      setFormData({
        patientName: '',
        bloodGroup: '',
        unitsRequired: 1,
        emergencyLevel: 'medium',
        contactNumber: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Request Blood</h2>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setFormData({ ...formData, bloodGroup: group })}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    formData.bloodGroup === group
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Units Required *
            </label>
            <input
              type="number"
              value={formData.unitsRequired}
              onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value) })}
              className="input-field"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Level *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {emergencyLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, emergencyLevel: level })}
                  className={`py-2 px-3 rounded-lg font-medium transition ${
                    formData.emergencyLevel === level
                      ? level === 'critical' ? 'bg-red-600 text-white' :
                      level === 'high' ? 'bg-orange-500 text-white' :
                      level === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Any additional information..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <FaTint className="inline mr-2" />
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      {/* Emergency Notice */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-red-600 text-xl mr-3 mt-1" />
          <div>
            <h3 className="font-bold text-red-800 mb-2">Emergency Blood Request</h3>
            <p className="text-red-700">
              For critical emergencies, please call our 24/7 helpline: <strong>1800-123-4567</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalBloodRequest;
