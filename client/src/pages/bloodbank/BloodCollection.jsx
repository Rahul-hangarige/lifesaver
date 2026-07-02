import { useState } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaTint, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BloodBankCollection = () => {
  const [formData, setFormData] = useState({
    donorId: '',
    bagId: '',
    bloodGroup: '',
    component: 'whole_blood',
    collectionDate: new Date().toISOString().split('T')[0],
    volume: 450
  });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components = ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.donorId || !formData.bagId || !formData.bloodGroup) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await bloodService.addBloodBag(formData);
      toast.success('Blood bag recorded successfully');
      setFormData({
        donorId: '',
        bagId: '',
        bloodGroup: '',
        component: 'whole_blood',
        collectionDate: new Date().toISOString().split('T')[0],
        volume: 450
      });
    } catch (error) {
      toast.error('Failed to record blood bag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Blood Collection</h2>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donor ID *
            </label>
            <input
              type="text"
              value={formData.donorId}
              onChange={(e) => setFormData({ ...formData, donorId: e.target.value })}
              className="input-field"
              placeholder="Enter donor ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Bag ID *
            </label>
            <input
              type="text"
              value={formData.bagId}
              onChange={(e) => setFormData({ ...formData, bagId: e.target.value })}
              className="input-field"
              placeholder="Enter bag ID"
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
              Blood Component *
            </label>
            <select
              value={formData.component}
              onChange={(e) => setFormData({ ...formData, component: e.target.value })}
              className="input-field"
            >
              {components.map((comp) => (
                <option key={comp} value={comp}>
                  {comp.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Date *
            </label>
            <input
              type="date"
              value={formData.collectionDate}
              onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume (ml) *
            </label>
            <input
              type="number"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: parseInt(e.target.value) })}
              className="input-field"
              min="1"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <FaSave className="inline mr-2" />
            {loading ? 'Saving...' : 'Record Blood Bag'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BloodBankCollection;
