import { useState } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaSearch, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const HospitalAvailableBlood = () => {
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    component: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components = ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate'];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.bloodGroup) {
      alert('Please select a blood group');
      return;
    }

    setLoading(true);
    try {
      const response = await bloodService.getAvailableBlood(
        searchParams.bloodGroup,
        searchParams.component
      );
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error('Error searching blood:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Blood</h2>

      {/* Search Form */}
      <div className="card max-w-2xl mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSearchParams({ ...searchParams, bloodGroup: group })}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    searchParams.bloodGroup === group
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
              Blood Component (Optional)
            </label>
            <select
              value={searchParams.component}
              onChange={(e) => setSearchParams({ ...searchParams, component: e.target.value })}
              className="input-field"
            >
              <option value="">All Components</option>
              {components.map((comp) => (
                <option key={comp} value={comp}>
                  {comp.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <FaSearch className="inline mr-2" />
            {loading ? 'Searching...' : 'Search Blood'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {results.length} unit(s) available
          </h3>

          {results.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 text-lg">
                No blood available matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((blood) => (
                <div key={blood._id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-bold">
                      {blood.bloodGroup}
                    </span>
                    <span className="text-sm text-gray-500">
                      {blood.component.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <span className="font-medium">{blood.bloodBankId?.bankName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-2" />
                      <span>{blood.bloodBankId?.phone}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires: {new Date(blood.expiryDate).toLocaleDateString()}
                    </div>
                  </div>

                  <button className="btn-primary w-full mt-4">
                    Contact Blood Bank
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalAvailableBlood;
