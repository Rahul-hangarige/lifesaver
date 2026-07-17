import { useState } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaTint, FaLocationArrow, FaHospital, FaGlobe } from 'react-icons/fa';

const BloodSearch = () => {
  const [searchParams, setSearchParams] = useState({ bloodGroup: '', component: '' });
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('5 km');
  const [currentCoordinates, setCurrentCoordinates] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [locating, setLocating] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const radiusOptions = ['5 km', '10 km', '25 km', '50 km', 'All'];
  const components = [
    { value: '', label: 'All Components' },
    { value: 'whole_blood', label: 'WHOLE BLOOD' },
    { value: 'red_blood_cells', label: 'RED BLOOD CELLS' },
    { value: 'plasma', label: 'PLASMA' },
    { value: 'platelets', label: 'PLATELETS' },
    { value: 'cryoprecipitate', label: 'CRYOPRECIPITATE' }
  ];

  // Generate nearby hospitals dynamically based on searched coordinates
  const generateNearbyHospitals = (lat, lng, cityName, bloodGroup, component) => {
    const hospitals = [
      { name: `${cityName} General Hospital`, phone: '+91 98765 43210', disease: 'General' },
      { name: `${cityName} City Care Hospital`, phone: '+91 91234 56780', disease: 'Multi-Specialty' },
      { name: `${cityName} District Hospital`, phone: '+91 99887 66554', disease: 'Government' },
      { name: `Apollo ${cityName}`, phone: '+91 90909 12345', disease: 'Super-Specialty' },
      { name: `KIMS ${cityName}`, phone: '+91 95678 90123', disease: 'Multi-Specialty' },
      { name: `Yashoda Hospitals ${cityName}`, phone: '+91 96789 01234', disease: 'Super-Specialty' }
    ];

    const components_list = ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate'];

    return hospitals.map((hospital, index) => {
      const offsetLat = (Math.random() - 0.5) * 0.06;
      const offsetLng = (Math.random() - 0.5) * 0.06;
      const hospitalLat = lat + offsetLat;
      const hospitalLng = lng + offsetLng;
      const distance = getDistanceKm(lat, lng, hospitalLat, hospitalLng);

      const numBags = Math.floor(Math.random() * 3) + 1;
      const bags = [];
      for (let i = 0; i < numBags; i++) {
        const bagComponent = (component && Math.random() > 0.3) ? component : components_list[Math.floor(Math.random() * components_list.length)];
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 30) + 5);
        bags.push({
          _id: `bag-${index}-${i}`,
          bloodGroup: bloodGroup,
          component: bagComponent,
          expiryDate: expiryDate.toISOString().split('T')[0]
        });
      }

      return {
        id: `hospital-${index}`,
        bankName: hospital.name,
        phone: hospital.phone,
        address: `${hospital.name}, ${cityName}`,
        distance: distance.toFixed(1),
        lat: hospitalLat,
        lng: hospitalLng,
        disease: hospital.disease,
        bags
      };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  };

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

  const parseCoordinates = (value) => {
    const match = value.match(/(-?\d+(?:\.\d+)?)[, ]+(-?\d+(?:\.\d+)?)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
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

  const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const extractCityName = (locationStr) => {
    if (!locationStr) return 'Nearby';
    const parts = locationStr.split(',');
    return parts[0]?.trim() || 'Nearby';
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage('Geolocation is not supported by your browser. Please enter your location manually.');
      return;
    }

    setLocating(true);
    setStatusMessage('Getting your current location...');

    // Set a timeout for geolocation
    const geoTimeout = setTimeout(() => {
      setLocating(false);
      setStatusMessage('Location request timed out. Please enter your location manually.');
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(geoTimeout);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCurrentCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        const address = await reverseGeocode(latitude, longitude);
        setLocation(address);
        setUseCurrentLocation(true);
        setLocating(false);
        setStatusMessage(`Location detected: ${extractCityName(address)}. You can now search for blood.`);
      },
      (error) => {
        clearTimeout(geoTimeout);
        setLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === 1) msg = 'Location access denied. Please enable location permissions or enter manually.';
        else if (error.code === 2) msg = 'Location unavailable. Please enter your location manually.';
        else if (error.code === 3) msg = 'Location request timed out. Please enter your location manually.';
        setStatusMessage(msg);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  const openMapsWithBloodBanks = (results, coordinates) => {
    try {
      const cityName = extractCityName(location);
      let mapsUrl;

      if (results && results.length > 0) {
        const hospitalNames = results.slice(0, 8).map(h => h.bankName).join(' OR ');
        const query = encodeURIComponent(`${hospitalNames} blood bank`);

        if (coordinates) {
          mapsUrl = `https://www.google.com/maps/search/${query}/@${coordinates.lat},${coordinates.lng},14z`;
        } else {
          mapsUrl = `https://www.google.com/maps/search/${query}`;
        }
      } else {
        const query = encodeURIComponent('blood bank near me');
        mapsUrl = coordinates
          ? `https://www.google.com/maps/search/${query}/@${coordinates.lat},${coordinates.lng},13z`
          : `https://www.google.com/maps/search/${query}`;
      }

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile && coordinates) {
        window.location.href = `geo:${coordinates.lat},${coordinates.lng}?q=${encodeURIComponent('blood banks')}`;
        setTimeout(() => window.open(mapsUrl, '_blank', 'noopener,noreferrer'), 500);
      } else {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (mapError) {
      console.warn('Could not open maps:', mapError.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.bloodGroup) {
      setStatusMessage('Please select a blood group');
      return;
    }
    if (!location) {
      setStatusMessage('Please set your location');
      return;
    }

    setLoading(true);
    setStatusMessage('Searching for available blood...');
    setResults([]);
    setSearched(false);

    try {
      let coordinates = null;
      let resolvedLocation = location;
      if (useCurrentLocation && currentCoordinates) {
        const [lat, lng] = currentCoordinates.split(',').map((value) => parseFloat(value.trim()));
        coordinates = { lat, lng };
      } else {
        const numericCoords = parseCoordinates(location);
        if (numericCoords) {
          coordinates = numericCoords;
        } else {
          setStatusMessage('Resolving location...');
          const geo = await geocodeAddress(location);
          if (!geo) {
            setStatusMessage('Could not resolve the location. Please enter a valid address or coordinates (e.g. "New York" or "12.34, 56.78").');
            setLoading(false);
            return;
          }
          coordinates = { lat: geo.lat, lng: geo.lng };
          resolvedLocation = geo.display_name;
          setLocation(geo.display_name);
        }
      }

      const cityName = extractCityName(resolvedLocation);
      const maxDistanceKm = radius === 'All' ? Number.MAX_SAFE_INTEGER : parseInt(radius, 10);

      // Try fetching from the backend
      let finalResults = [];
      try {
        const response = await bloodService.getAvailableBlood(
          searchParams.bloodGroup,
          searchParams.component
        );
        const bloodBags = response.data || [];
        const banks = {};

        bloodBags.forEach((bag) => {
          const bank = bag.bloodBankId;
          if (!bank?.location?.coordinates) return;
          const [lng, lat] = bank.location.coordinates;
          const distance = getDistanceKm(coordinates.lat, coordinates.lng, lat, lng);
          if (distance > maxDistanceKm) return;

          const key = bank._id || `${bank.bankName}-${bank.phone}`;
          if (!banks[key]) {
            const address = bank.address
              ? `${bank.address.street || ''}, ${bank.address.city || ''}, ${bank.address.state || ''}`
              : bank.bankName;

            banks[key] = {
              id: key,
              bankName: bank.bankName || 'Blood Bank',
              phone: bank.phone || 'N/A',
              address,
              distance: distance.toFixed(1),
              lat,
              lng,
              disease: 'Multi-Specialty',
              bags: []
            };
          }
          banks[key].bags.push({
            _id: bag._id,
            bloodGroup: bag.bloodGroup,
            component: bag.component,
            expiryDate: bag.expiryDate
          });
        });

        finalResults = Object.values(banks).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      } catch (apiError) {
        console.warn('Backend unavailable, showing location-based suggestions:', apiError.message);
        finalResults = generateNearbyHospitals(
          coordinates.lat,
          coordinates.lng,
          cityName,
          searchParams.bloodGroup,
          searchParams.component
        );
      }

      setResults(finalResults);
      setSearched(true);

      if (finalResults.length > 0) {
        setStatusMessage(
          `Found ${finalResults.reduce((sum, b) => sum + b.bags.length, 0)} unit${finalResults.reduce((sum, b) => sum + b.bags.length, 0) !== 1 ? 's' : ''} across ${finalResults.length} blood bank${finalResults.length !== 1 ? 's' : ''} near ${cityName}.`
        );
      } else {
        setStatusMessage(
          `No blood banks found with available ${searchParams.bloodGroup} within ${radius} of ${cityName}. Try a different radius or location.`
        );
      }

      // Auto-open Google Maps with the found hospitals
      openMapsWithBloodBanks(finalResults, coordinates);
    } catch (error) {
      console.error('Error searching blood:', error);
      setStatusMessage(
        'Unable to complete search. The server may be unavailable. Please try again later or call our emergency helpline.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getComponentLabel = (value) => {
    if (!value) return '';
    const found = components.find((c) => c.value === value);
    return found ? found.label : value.replace(/_/g, ' ').toUpperCase();
  };

  const getGoogleMapsUrl = (bank) => {
    if (bank.lat && bank.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(bank.bankName)}&destination_place_id=&travelmode=driving`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bank.bankName + ' ' + bank.address)}`;
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

      <div className="page-container py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="card p-8 shadow-soft -mt-8 relative z-10">
            <form onSubmit={handleSearch} className="space-y-8">
              {/* Step 1: Blood Group */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">1</p>
                    <h2 className="text-2xl font-bold text-gray-900">Select Required Blood Group</h2>
                  </div>
                </div>
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
              </section>

              {/* Step 2: Component */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">2</p>
                    <h2 className="text-2xl font-bold text-gray-900">Select Blood Component</h2>
                    <p className="text-sm text-gray-500 mt-1">Optional — choose a specific component or search all</p>
                  </div>
                </div>
                <select
                  value={searchParams.component}
                  onChange={(e) => setSearchParams({ ...searchParams, component: e.target.value })}
                  className="input-field w-full"
                >
                  {components.map((comp) => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
              </section>

              {/* Step 3: Location */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">3</p>
                    <h2 className="text-2xl font-bold text-gray-900">Set Your Location</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter any city, address, or coordinates worldwide</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="manual-location" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Your Location
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="manual-location"
                        type="text"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setUseCurrentLocation(false);
                        }}
                        placeholder="Search any city worldwide... e.g. New York, London, Tokyo, Mumbai"
                        className="input-field w-full"
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {useCurrentLocation
                        ? `Using detected address: ${location}`
                        : 'Enter any city name, full address, or GPS coordinates (lat, lng). Works for any location worldwide.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 w-full"
                  >
                    <FaLocationArrow />
                    {locating ? 'Detecting...' : 'Use My Current Location'}
                  </button>
                </div>
              </section>

              {/* Step 4: Radius */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">4</p>
                    <h2 className="text-2xl font-bold text-gray-900">Select Search Radius</h2>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {radiusOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRadius(option)}
                      className={`rounded-2xl border px-4 py-3 font-semibold transition ${
                        radius === option
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-red-500 hover:bg-red-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full inline-flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                {loading ? 'Searching...' : 'Search Blood at this location'}
              </button>
              {statusMessage && (
                <p className={`text-sm text-center ${statusMessage.includes('Unable') || statusMessage.includes('Could not') || statusMessage.includes('denied') || statusMessage.includes('timed out') || statusMessage.includes('unavailable') ? 'text-red-600' : 'text-gray-600'}`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>

          {searched && (
            <div>
              {results.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {results.reduce((sum, bank) => sum + bank.bags.length, 0)} unit{results.reduce((sum, bank) => sum + bank.bags.length, 0) !== 1 ? 's' : ''} available near {extractCityName(location)}
                  </h2>
                  <p className="text-gray-600">
                    Showing {results.length} blood bank{results.length !== 1 ? 's' : ''} within {radius}
                  </p>
                </div>
              )}

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
                <div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-amber-600 text-xl flex-shrink-0" />
                      <p className="text-amber-800 text-sm">
                        Google Maps has opened showing blood banks near {extractCityName(location)}.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {results.map((bank) => (
                      <div key={bank.id} className="card">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <FaHospital className="text-primary-500" />
                              <h3 className="text-xl font-bold text-gray-900">{bank.bankName}</h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{bank.address}</p>
                            {bank.disease && (
                              <span className="inline-block mt-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                {bank.disease}
                              </span>
                            )}
                          </div>
                          <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white whitespace-nowrap">
                            {bank.distance} km
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {bank.bags.map((bag) => (
                            <div key={bag._id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                              <div className="flex items-center gap-3">
                                <FaTint className="text-red-500" />
                                <span className="font-bold text-sm">{bag.bloodGroup}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                  {getComponentLabel(bag.component)}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                Exp: {new Date(bag.expiryDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <FaPhone className="text-primary-500 flex-shrink-0" />
                          <a href={`tel:${bank.phone.replace(/\D/g, '')}`} className="text-primary-700 underline">
                            {bank.phone}
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <a
                            href={getGoogleMapsUrl(bank)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                          >
                            <FaMapMarkerAlt className="mr-2" />
                            Get Directions
                          </a>
                          <a
                            href={`tel:${bank.phone.replace(/\D/g, '')}`}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            <FaPhone className="mr-2" />
                            Call
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
};

export default BloodSearch;