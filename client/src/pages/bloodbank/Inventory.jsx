import { useState, useEffect } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaBox, FaFilter } from 'react-icons/fa';

const BloodBankInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState({ bloodGroup: '', component: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await bloodService.getInventory(filter);
      setInventory(response.data.bloodBags || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadInventory();
  };

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components = ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate'];
  const statuses = ['available', 'reserved', 'issued', 'expired', 'discarded'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'discarded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading inventory...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Blood Inventory</h2>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-gray-600" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
            <select
              value={filter.bloodGroup}
              onChange={(e) => setFilter({ ...filter, bloodGroup: e.target.value })}
              className="input-field"
            >
              <option value="">All</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Component</label>
            <select
              value={filter.component}
              onChange={(e) => setFilter({ ...filter, component: e.target.value })}
              className="input-field"
            >
              <option value="">All</option>
              {components.map((comp) => (
                <option key={comp} value={comp}>{comp.replace(/_/g, ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="input-field"
            >
              <option value="">All</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleFilter} className="btn-primary w-full">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {inventory.length === 0 ? (
        <div className="card text-center py-12">
          <FaBox className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No blood bags found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Bag ID</th>
                <th className="text-left py-3 px-4 font-semibold">Blood Group</th>
                <th className="text-left py-3 px-4 font-semibold">Component</th>
                <th className="text-left py-3 px-4 font-semibold">Collection Date</th>
                <th className="text-left py-3 px-4 font-semibold">Expiry Date</th>
                <th className="text-left py-3 px-4 font-semibold">Test Status</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((bag) => (
                <tr key={bag._id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{bag.bagId}</td>
                  <td className="py-3 px-4 font-bold">{bag.bloodGroup}</td>
                  <td className="py-3 px-4">{bag.component.replace(/_/g, ' ').toUpperCase()}</td>
                  <td className="py-3 px-4">{new Date(bag.collectionDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{new Date(bag.expiryDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bag.testStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      bag.testStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bag.testStatus.charAt(0).toUpperCase() + bag.testStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bag.status)}`}>
                      {bag.status.charAt(0).toUpperCase() + bag.status.slice(1)}
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

export default BloodBankInventory;
