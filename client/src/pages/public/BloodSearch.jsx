import { useState } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaTint } from 'react-icons/fa';

const BloodSearch = () => {
  const [searchParams, setSearchParams] = useState({ bloodGroup: '', component: '', location: 'Hyderabad' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components = ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate'];
  const locations = ['Hyderabad', 'Warangal', 'Hanmakonda', 'Kazipet'];
  const famousHospitals = {
    Hyderabad: ['Apollo Hospital', 'Yashoda Hospitals', 'KIMS Hospital', 'NIMS'],
    Warangal: ['Kakatiya Medical College', 'Yasoda Hospital Warangal', 'Govt. Hospital', 'Ganga Hospital'],
    Hanmakonda: ['Hanmakonda General Hospital', 'Prathima Hospital', 'Nirmala Hospital', 'Samraksha Hospital'],
    Kazipet: ['Kazipet Community Hospital', 'Sree Hospitals', 'City Care Hospital', 'Azara Hospital'],
  };
  const preferredHospitals = {
    Hyderabad: 'NIMS',
    Warangal: 'Ganga Hospital',
    Hanmakonda: 'Samraksha Hospital',
    Kazipet: 'Azara Hospital',
  };
  const nearestHospitalDetails = {
    Hyderabad: [
      { name: 'Apollo Hospital', phone: '+91 98765 43210', urgency: 'High', requestedLocation: 'Banjara Hills' },
      { name: 'Yashoda Hospitals', phone: '+91 91234 56780', urgency: 'Critical', requestedLocation: 'Ameerpet' },
      { name: 'NIMS', phone: '+91 99887 66554', urgency: 'Moderate', requestedLocation: 'Musheerabad' },
    ],
    Warangal: [
      { name: 'Kakatiya Medical College', phone: '+91 98765 11223', urgency: 'Critical', requestedLocation: 'Warangal City' },
      { name: 'Yasoda Hospital Warangal', phone: '+91 90123 45678', urgency: 'High', requestedLocation: 'Kazipet' },
      { name: 'Ganga Hospital', phone: '+91 90909 12345', urgency: 'Moderate', requestedLocation: 'Madikonda' },
    ],
    Hanmakonda: [
      { name: 'Samraksha Hospital', phone: '+91 92345 67890', urgency: 'High', requestedLocation: 'Hanmakonda Road' },
      { name: 'Prathima Hospital', phone: '+91 93456 78901', urgency: 'Moderate', requestedLocation: 'Palakurthi' },
      { name: 'Nirmala Hospital', phone: '+91 94567 89012', urgency: 'Critical', requestedLocation: 'Nirmal Colony' },
    ],
    Kazipet: [
      { name: 'Kazipet Community Hospital', phone: '+91 95678 90123', urgency: 'High', requestedLocation: 'Kazipet Junction' },
      { name: 'Azara Hospital', phone: '+91 96789 01234', urgency: 'Critical', requestedLocation: 'Azad Nagar' },
      { name: 'City Care Hospital', phone: '+91 97890 12345', urgency: 'Moderate', requestedLocation: 'Station Road' },
    ],
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.bloodGroup) {
      alert('Please select a blood group');
      return;
    }

    setLoading(true);
    try {
      const response = await bloodBankService.getAvailableBlood(
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
      <section className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Available Blood</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Find blood availability across our network of partner blood banks
          </p>
        </div>
      </section>

      <div className="page-container">
        <div className="card max-w-2xl mx-auto mb-12 -mt-8 relative z-10 shadow-soft">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Blood Group *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSearchParams({ ...searchParams, bloodGroup: group })}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${
                      searchParams.bloodGroup === group
                        ? 'bg-primary-600 text-white shadow-md scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Location
              </label>
              <select
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                className="input-field"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              <FaSearch className="mr-2" />
              {loading ? 'Searching...' : 'Search Blood'}
            </button>
          </form>
        </div>

        {searched && (
          <div className="mb-12">
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Popular Hospitals in {searchParams.location}</h3>
                <ul className="space-y-2 text-gray-600">
                  {famousHospitals[searchParams.location].map((hospital) => (
                    <li key={hospital} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                      {hospital}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Nearby Blood Requests</h3>
                <p className="text-gray-600">Requests shown are generally within a 5 to 20 km radius of {searchParams.location}.</p>
              </div>
              {searched && (
                <div className="rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Nearest Hospitals</h3>
                  <div className="space-y-4">
                    {nearestHospitalDetails[searchParams.location].map((hospital) => (
                      <div key={hospital.name} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="font-semibold text-gray-900">{hospital.name}</p>
                        <p className="text-sm text-gray-600">
                          Phone: <a href={`tel:${hospital.phone.replace(/\D/g, '')}`} className="text-primary-700 underline">{hospital.phone}</a>
                        </p>
                        <p className="text-sm text-gray-600">
                          Urgency: <span className="font-medium">{hospital.urgency}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Requested Location: <span className="font-medium">{hospital.requestedLocation}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {results.length} unit{results.length !== 1 ? 's' : ''} available near {searchParams.location}
            </h2>

            {results.length === 0 ? (
              <div className="card text-center py-16 max-w-lg mx-auto">
                <FaTint className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No blood available matching your criteria.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try different options or contact us for emergency assistance.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((blood) => {
                  const distance = Math.min(20, Math.max(5, Math.floor((blood._id?.charCodeAt(0) || 5) % 16 + 5)));
                  const preferredHospital = preferredHospitals[searchParams.location];
                  return (
                    <div key={blood._id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <span className="badge font-bold text-base">{blood.bloodGroup}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {blood.component.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="space-y-2.5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-primary-500 flex-shrink-0" />
                          <span className="font-medium">{blood.bloodBankId?.bankName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-primary-500 flex-shrink-0" />
                          <span>{blood.bloodBankId?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{distance} km away</span>
                        </div>
                        <p className="text-sm text-gray-400 pt-1">
                          Expires: {new Date(blood.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-5 grid gap-3">
                        <button className="btn-primary w-full text-sm py-2.5">
                          Contact Blood Bank
                        </button>
                        {preferredHospital && (
                          <button
                            type="button"
                            onClick={() => window.open(
                              `https://www.google.com/maps/search/${encodeURIComponent(preferredHospital)}`,
                              '_blank'
                            )}
                            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white transition hover:bg-amber-800"
                            aria-label={`Navigate to ${preferredHospital}`}
                          >
                            Navigate to {preferredHospital}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="emergency-banner">
          <h3 className="text-lg font-bold text-red-800 mb-2">Emergency Blood Request</h3>
          <p className="text-red-700 mb-3">If you need blood urgently, call our 24/7 helpline:</p>
          <p className="text-2xl md:text-3xl font-bold text-red-600">
            <a href="tel:18001234567" className="underline hover:text-red-800">1800-123-4567</a>
          </p>
          <p className="text-red-500 text-sm mt-2">Available 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default BloodSearch;
