import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import toast from 'react-hot-toast';

const DonorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await donorService.getProfile();
      setProfile(response.data);
      setFormData({
        ...response.data,
        address: response.data.address || {}
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatePayload = {};

      if (formData.bloodGroup !== undefined) updatePayload.bloodGroup = formData.bloodGroup;
      if (formData.dateOfBirth !== undefined) updatePayload.dateOfBirth = formData.dateOfBirth;
      if (formData.gender !== undefined) updatePayload.gender = formData.gender;
      if (formData.weight !== undefined) updatePayload.weight = formData.weight;
      if (formData.age !== undefined) updatePayload.age = formData.age;
      if (formData.address !== undefined) updatePayload.address = formData.address;
      if (formData.medicalHistory !== undefined) updatePayload.medicalHistory = formData.medicalHistory;

      const response = await donorService.updateProfile(updatePayload);
      const updatedProfile = {
        ...profile,
        ...response.data,
        address: response.data.address || {},
        userId: typeof response.data.userId === 'object' ? response.data.userId : profile.userId
      };
      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Donor profile update failed:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      <div className="card">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={editing ? formData.userId?.name : profile?.userId?.name}
              disabled={!editing}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={editing ? formData.userId?.email : profile?.userId?.email}
              disabled={!editing}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={editing ? formData.userId?.phone : profile?.userId?.phone}
              disabled={!editing}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select
              value={editing ? formData.bloodGroup || '' : profile?.bloodGroup || ''}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="input-field disabled:bg-gray-100"
            >
              <option value="">Select Blood Group</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={editing ? formData.dateOfBirth?.split('T')[0] : profile?.dateOfBirth?.split('T')[0]}
              disabled={!editing}
              className="input-field disabled:bg-gray-100"
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={editing ? formData.gender : profile?.gender}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="input-field disabled:bg-gray-100"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={editing ? formData.weight : profile?.weight}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={editing ? formData.age : profile?.age}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="input-field disabled:bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={editing ? formData.address?.street : profile?.address?.street}
              disabled={!editing}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value }
              })}
              placeholder="Street"
              className="input-field disabled:bg-gray-100 mb-2"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={editing ? formData.address?.city : profile?.address?.city}
                disabled={!editing}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                placeholder="City"
                className="input-field disabled:bg-gray-100"
              />
              <input
                type="text"
                value={editing ? formData.address?.state : profile?.address?.state}
                disabled={!editing}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                placeholder="State"
                className="input-field disabled:bg-gray-100"
              />
              <input
                type="text"
                value={editing ? formData.address?.zipCode : profile?.address?.zipCode}
                disabled={!editing}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zipCode: e.target.value }
                })}
                placeholder="ZIP Code"
                className="input-field disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
            <textarea
              value={editing ? formData.medicalHistory : profile?.medicalHistory}
              disabled={!editing}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              rows="3"
              className="input-field disabled:bg-gray-100"
              placeholder="Any relevant medical information..."
            />
          </div>
        </div>

        {editing && (
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={() => setEditing(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorProfile;
