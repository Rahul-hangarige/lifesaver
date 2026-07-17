import { useState } from 'react';
import { requestService } from '../../services/requestService';
import { FaTint, FaLocationArrow, FaMapMarkerAlt, FaExclamationTriangle, FaAmbulance, FaClock, FaHospital, FaMapPin } from 'react-icons/fa';
import toast from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyOptions = [
  { value: 'critical', label: 'Critical (Within 1 hour)', color: 'red', icon: FaAmbulance },
  { value: 'high', label: 'Urgent (Within 6 hours)', color: 'orange', icon: FaExclamationTriangle },
  { value: 'medium', label: 'Normal (Within 24 hours)', color: 'yellow', icon: FaClock }
];

const HospitalBloodRequest = () => {
  const [formData, setFormData] = useState({
    requesterName: '',
    requesterEmail: '',
    contactNumber: '',
    bloodGroup: '',
    hospitalName: '',
    hospitalLocation: '',
    hospitalLat: '',
    hospitalLng: '',
    urgencyLevel: 'medium',
    unitsRequired: 1,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [locating, setLocating] = useState(false);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      const data = await response.json();
      return data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      const data = await response.json();
      if (data?.[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationStatus('Detecting current location...');

    const geoTimeout = setTimeout(() => {
      setLocating(false);
      setLocationStatus('Location request timed out. Please enter manually.');
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(geoTimeout);
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          hospitalLat: latitude.toFixed(6),
          hospitalLng: longitude.toFixed(6),
          hospitalLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        }));
        const address = await reverseGeocode(latitude, longitude);
        setFormData((prev) => ({
          ...prev,
          hospitalLocation: address
        }));
        setLocating(false);
        setLocationStatus('Current location detected and address resolved.');
        toast.success('Hospital location set to current position');
      },
      (error) => {
        clearTimeout(geoTimeout);
        setLocating(false);
        if (error.code === 1) setLocationStatus('Location access denied. Please enter manually.');
        else if (error.code === 2) setLocationStatus('Location unavailable. Please enter manually.');
        else setLocationStatus('Location request timed out. Please enter manually.');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleOpenMaps = () => {
    const { hospitalLat, hospitalLng, hospitalLocation } = formData;
    if (hospitalLat && hospitalLng) {
      window.open(
        `https://www.google.com/maps?q=${hospitalLat},${hospitalLng}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else if (hospitalLocation) {
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(hospitalLocation)}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      toast.error('Please enter or detect a hospital location first.');
    }
  };

  const handleResolveAddress = async () => {
    if (!formData.hospitalLocation || formData.hospitalLocation.trim() === '') {
      toast.error('Please enter a hospital location first.');
      return;
    }
    setLocationStatus('Resolving address to coordinates...');
    const geo = await geocodeAddress(formData.hospitalLocation);
    if (geo) {
      setFormData((prev) => ({
        ...prev,
        hospitalLat: geo.lat.toFixed(6),
        hospitalLng: geo.lng.toFixed(6),
        hospitalLocation: geo.display_name
      }));
      setLocationStatus(`Location resolved: ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}`);
      toast.success('Location coordinates resolved');
    } else {
      setLocationStatus('Could not resolve coordinates for this address.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { requesterName, requesterEmail, contactNumber, bloodGroup, hospitalName, hospitalLocation, urgencyLevel } = formData;
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
        hospitalLat: formData.hospitalLat,
        hospitalLng: formData.hospitalLng,
        emergencyLevel: urgencyLevel,
        notes: formData.notes,
        unitsRequired: formData.unitsRequired
      });
      toast.success('Blood request submitted successfully');
      setFormData({
        requesterName: '',
        requesterEmail: '',
        contactNumber: '',
        bloodGroup: '',
        hospitalName: '',
        hospitalLocation: '',
        hospitalLat: '',
        hospitalLng: '',
        urgencyLevel: 'medium',
        unitsRequired: 1,
        notes: ''
      });
      setLocationStatus('');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level) => {
    const colors = { critical: 'bg-red-50 border-red-300 text-red-700', high: 'bg-orange-50 border-orange-300 text-orange-700', medium: 'bg-yellow-50 border-yellow-300 text-yellow-700' };
    return colors[level] || colors.medium;
  };

  const getUrgencyBadge = (level) => {
    const badges = { critical: 'bg-red-600', high: 'bg-orange-500', medium: 'bg-yellow-400' };
    return badges[level] || badges.medium;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Request Blood</h2>
        <p className="text-gray-600 mt-1">Submit an emergency blood request for your hospital</p>
      </div>

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Requester Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaHospital className="text-primary-600" /> Requester Information
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Dr. John Doe"
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
                  placeholder="e.g. +1 234 567 8900"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.requesterEmail}
                  onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                  className="input-field"
                  placeholder="e.g. doctor@hospital.com"
                  required
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Blood Request Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaTint className="text-red-600" /> Blood Request Details
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Units Required</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.unitsRequired}
                  onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value) || 1 })}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Urgency Level with Visual Indicators */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-orange-500" /> Urgency Level
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {urgencyOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.urgencyLevel === option.value;
                const colors = {
                  critical: isSelected ? 'border-red-600 bg-red-50 ring-2 ring-red-600' : 'border-gray-200 hover:border-red-400',
                  high: isSelected ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' : 'border-gray-200 hover:border-orange-400',
                  medium: isSelected ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-400' : 'border-gray-200 hover:border-yellow-300'
                };
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgencyLevel: option.value })}
                    className={`relative rounded-2xl border-2 p-4 text-left transition-all ${colors[option.value]}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`text-lg ${isSelected ? `text-${option.color}-600` : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold uppercase tracking-wide ${isSelected ? `text-${option.color}-700` : 'text-gray-500'}`}>
                        {option.value}
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Hospital Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary-600" /> Hospital Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
                <input
                  type="text"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. City General Hospital"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Location *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.hospitalLocation}
                    onChange={(e) => setFormData({ ...formData, hospitalLocation: e.target.value })}
                    className="input-field flex-1"
                    placeholder="Enter address, city, or coordinates"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleResolveAddress}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    title="Resolve coordinates from address"
                  >
                    <FaMapPin className="text-primary-600" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaLocationArrow />
                    {locating ? 'Detecting...' : 'Use Current Location'}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenMaps}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <FaMapMarkerAlt className="text-primary-600" />
                    Show on Maps
                  </button>
                </div>
                {locationStatus && (
                  <p className="mt-2 text-sm text-gray-500">{locationStatus}</p>
                )}
                {formData.hospitalLat && formData.hospitalLng && (
                  <p className="mt-1 text-xs text-gray-400">
                    Coordinates: {formData.hospitalLat}, {formData.hospitalLng}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Any additional information about the patient or requirements..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center text-lg py-4">
            <FaTint className="mr-2" />
            {loading ? 'Submitting Request...' : 'Submit Blood Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HospitalBloodRequest;