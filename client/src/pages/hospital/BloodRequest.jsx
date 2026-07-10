import { useState } from 'react';
import { requestService } from '../../services/requestService';
import { FaTint, FaLocationArrow } from 'react-icons/fa';
import toast from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyOptions = [
  { value: 'critical', label: 'Critical (Within 1 hour)' },
  { value: 'high', label: 'Urgent (Within 6 hours)' },
  { value: 'medium', label: 'Normal (Within 24 hours)' }
];

const HospitalBloodRequest = () => {
  const [formData, setFormData] = useState({
    requesterName: '',
    requesterEmail: '',
    contactNumber: '',
    bloodGroup: '',
    hospitalName: '',
    hospitalLocation: '',
    urgencyLevel: 'medium',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Detecting current location…');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setFormData((prev) => ({
          ...prev,
          hospitalLocation: address
        }));
        setLocationStatus('Current location detected.');
      },
      () => {
        setLocationStatus('Unable to retrieve current location.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { requesterName, requesterEmail, contactNumber, bloodGroup, hospitalName, hospitalLocation, urgencyLevel, notes } = formData;
    if (!requesterName || !requesterEmail || !contactNumber || !bloodGroup || !hospitalName || !hospitalLocation) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await requestService.createRequest({
        patientName: requesterName,
        requesterEmail,
        contactNumber,
        bloodGroup,
        hospitalName,
        hospitalLocation,
        emergencyLevel: urgencyLevel,
        notes,
        unitsRequired: 1
      });
      toast.success('Blood request submitted successfully');
      setFormData({
        requesterName: '',
        requesterEmail: '',
        contactNumber: '',
        bloodGroup: '',
        hospitalName: '',
        hospitalLocation: '',
        urgencyLevel: 'medium',
        notes: ''
      });
      setLocationStatus('');
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
            <input
              type="text"
              value={formData.requesterName}
              onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Blood Group *</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="input-field w-full"
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
            <input
              type="text"
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital Location * <span className="text-gray-500">** Use Current Location</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.hospitalLocation}
                onChange={(e) => setFormData({ ...formData, hospitalLocation: e.target.value })}
                className="input-field flex-1"
                placeholder="Enter location or use current location"
                required
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                <FaLocationArrow /> Use Current Location
              </button>
            </div>
            {locationStatus && <p className="mt-2 text-sm text-gray-500">{locationStatus}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
            <select
              value={formData.urgencyLevel}
              onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
              className="input-field w-full"
              required
            >
              {urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="4"
              placeholder="Any additional information..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <FaTint className="inline mr-2" />
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalBloodRequest;
