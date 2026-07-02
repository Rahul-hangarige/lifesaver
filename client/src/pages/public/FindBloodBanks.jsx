import { useState } from 'react';
import { FaLocationArrow, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { bloodService } from '../../services/bloodService';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const radiusOptions = ['5 km', '10 km', '25 km', '50 km', 'All'];
const defaultHospitals = [
  {
    id: 'azara',
    bankName: 'Azara Hospital',
    phone: '9876543210',
    address: 'Azara, Guwahati, Assam',
    availableUnits: 10,
    distance: '3.2',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=26.1530,91.7458'
  },
  {
    id: 'kims',
    bankName: 'KIMS Hospital',
    phone: '9876543211',
    address: 'Maligaon, Guwahati, Assam',
    availableUnits: 6,
    distance: '4.8',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=26.1600,91.7085'
  },
  {
    id: 'nims',
    bankName: 'NIMS Hospital',
    phone: '9876543212',
    address: 'Rani Ghat, Guwahati, Assam',
    availableUnits: 8,
    distance: '5.4',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=26.1638,91.7359'
  },
  {
    id: 'ganga',
    bankName: 'Ganga Hospital',
    phone: '9876543213',
    address: 'Ganga Nagar, Guwahati, Assam',
    availableUnits: 7,
    distance: '6.1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=26.1990,91.7406'
  }
];

const FindBloodBanks = () => {
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('5 km');
  const [currentCoordinates, setCurrentCoordinates] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleBackToList = () => {
    setSelectedHospital(null);
  };

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

  const parseCoordinates = (value) => {
    const match = value.match(/(-?\d+(?:\.\d+)?)[, ]+(-?\d+(?:\.\d+)?)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
      );
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

  const handleSearch = async () => {
    if (!selectedGroup || !location) {
      setStatusMessage('Please select a blood group and enter a location.');
      return;
    }

    setLoading(true);
    setStatusMessage('Searching hospitals and blood availability...');
    setResults([]);
    setSearched(false);

    try {
      let coordinates = null;
      if (useCurrentLocation && currentCoordinates) {
        const [lat, lng] = currentCoordinates.split(',').map((value) => parseFloat(value.trim()));
        coordinates = { lat, lng };
      } else {
        const numericCoords = parseCoordinates(location);
        if (numericCoords) {
          coordinates = numericCoords;
        } else {
          const geo = await geocodeAddress(location);
          if (!geo) {
            setStatusMessage('Could not resolve the location. Please enter a valid address or coordinates.');
            setLoading(false);
            return;
          }
          coordinates = { lat: geo.lat, lng: geo.lng };
          setLocation(geo.display_name);
        }
      }

      const maxDistanceKm = radius === 'All' ? 50 : parseInt(radius, 10);
      const defaultResults = defaultHospitals.map((hospital) => ({
        ...hospital,
        availableUnits: hospital.availableUnits,
        phone: hospital.phone
      }));

      const response = await bloodService.getAvailableBlood(selectedGroup);
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
            ? `${bank.address.street}, ${bank.address.city}, ${bank.address.state}`
            : bank.bankName;

          banks[key] = {
            id: key,
            bankName: bank.bankName || 'Blood Bank',
            phone: bank.phone || 'N/A',
            email: bank.email || 'N/A',
            address,
            coordinates: { lat, lng },
            availableUnits: 0,
            distance: distance.toFixed(1),
            mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`
          };
        }
        banks[key].availableUnits += 1;
      });

      const resultList = Object.values(banks).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      const finalResults = [...defaultResults, ...resultList];

      setResults(finalResults);
      setSearched(true);
      setStatusMessage(
        finalResults.length
          ? `Showing ${finalResults.length} hospitals with available ${selectedGroup} within ${radius}.`
          : `No hospitals found with available ${selectedGroup} within ${radius}.`
      );
    } catch (error) {
      console.error('Search failed:', error);
      setStatusMessage('Unable to complete search. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage('Geolocation is not supported by your browser.');
      return;
    }

    setStatusMessage('Getting your current location…');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCurrentCoordinates(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        const address = await reverseGeocode(latitude, longitude);
        setLocation(address);
        setUseCurrentLocation(true);
        setStatusMessage('Current location detected and address filled automatically.');
      },
      () => {
        setStatusMessage('Unable to retrieve your location. Please enter it manually.');
      }
    );
  };

  return (
    <div>
      <section className="page-hero relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Blood Banks</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Select the blood group, set your location, choose a search radius, and find nearby blood banks.
          </p>
        </div>
      </section>

      <div className="page-container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-10">
            <section className="rounded-[20px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">1</p>
                  <h2 className="text-2xl font-bold text-gray-900">Select Required Blood Group</h2>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {bloodGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedGroup(group)}
                    className={`rounded-2xl border px-4 py-3 font-semibold transition ${
                      selectedGroup === group
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-red-500 hover:bg-red-50'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[20px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">2</p>
                  <h2 className="text-2xl font-bold text-gray-900">Set Your Location</h2>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  <FaLocationArrow />
                  Use My Current Location
                </button>
                <div>
                  <label htmlFor="manual-location" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Location Manually
                  </label>
                  <input
                    id="manual-location"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setUseCurrentLocation(false);
                    }}
                    placeholder="Enter address or coordinates"
                    className="input-field w-full"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {useCurrentLocation
                      ? `Using detected address from your current location${currentCoordinates ? ` (${currentCoordinates})` : ''}.`
                      : 'Enter an address or coordinates if you prefer to set location manually.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">3</p>
                  <h2 className="text-2xl font-bold text-gray-900">Select Search Radius</h2>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
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

            <div className="text-center">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                <FaSearch className="mr-3" />
                {loading ? 'Searching...' : 'Search Blood Banks'}
              </button>
              {statusMessage && <p className="mt-4 text-sm text-gray-600">{statusMessage}</p>}
            </div>
          </div>

          <aside className="rounded-[20px] border border-gray-200 bg-gray-50 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Guide</h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <strong className="text-gray-900">Select Required Blood Group</strong>
                <p className="mt-1 text-sm text-gray-500">Choose the blood group you need for your search.</p>
              </li>
              <li>
                <strong className="text-gray-900">Set Your Location</strong>
                <p className="mt-1 text-sm text-gray-500">Use your device location or type coordinates manually.</p>
              </li>
              <li>
                <strong className="text-gray-900">Select Search Radius</strong>
                <p className="mt-1 text-sm text-gray-500">Narrow down results by distance from your location.</p>
              </li>
            </ul>
          </aside>
        </div>

        {searched && (
          <section className="rounded-[20px] border border-gray-200 bg-white p-8 shadow-sm mt-10">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {results.length ? `Hospitals with available ${selectedGroup}` : 'No Hospitals Found'}
                </h2>
                <p className="mt-2 text-gray-600">
                  Results shown within {radius} of {useCurrentLocation ? 'your current location' : location}
                </p>
              </div>
              {results.length > 0 && (
                <p className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                  {results.reduce((sum, bank) => sum + bank.availableUnits, 0)} units available
                </p>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
                No blood banks were found within the selected radius. Try a different radius or location.
              </div>
            ) : selectedHospital ? (
              <section className="rounded-[20px] border border-gray-200 bg-white p-8 shadow-sm mt-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedHospital.bankName}</h2>
                    <p className="mt-2 text-gray-600">{selectedHospital.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Back to List
                  </button>
                </div>

                <div className="relative mx-auto mt-10 flex h-[560px] w-[560px] max-w-full items-center justify-center rounded-full bg-red-50 p-8 shadow-sm">
                  <div className="absolute inset-0 rounded-full border border-red-200" />
                  <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2">
                    {[25, 50, 75, 100].map((percent) => (
                      <div
                        key={percent}
                        className="absolute left-1/2 top-1/2 rounded-full border border-red-200/60"
                        style={{
                          width: `${percent}%`,
                          height: `${percent}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white p-4 text-center shadow-xl">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-600">Selected Hospital</p>
                    <p className="mt-2 font-semibold text-gray-900">{selectedHospital.bankName}</p>
                    <p className="mt-2 text-xs text-gray-500 line-clamp-3">{selectedHospital.address}</p>
                  </div>

                  {results
                    .filter((bank) => bank.id !== selectedHospital.id)
                    .slice(0, 3)
                    .map((bank, index) => {
                      const angle = [330, 90, 210][index];
                      const maxRadius = 180;
                      const selectedRadius = radius === 'All' ? 50 : parseInt(radius, 10);
                      const distanceValue = Math.min(parseFloat(bank.distance) || selectedRadius, selectedRadius);
                      const distancePct = selectedRadius ? distanceValue / selectedRadius : 1;
                      const offset = 70 + distancePct * maxRadius;
                      const x = Math.cos((angle * Math.PI) / 180) * offset;
                      const y = Math.sin((angle * Math.PI) / 180) * offset;

                      return (
                        <div
                          key={bank.id}
                          className="absolute z-20 w-48 rounded-[20px] border border-gray-200 bg-white p-4 shadow-sm"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                          }}
                        >
                          <p className="text-sm font-semibold text-red-700">{bank.bankName}</p>
                          <p className="mt-1 text-sm text-gray-600">{bank.address}</p>
                          <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-red-50 p-3 text-sm">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Units</p>
                              <p className="mt-1 font-semibold text-gray-900">{bank.availableUnits}</p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Dist</p>
                              <p className="mt-1 font-semibold text-gray-900">{bank.distance} km</p>
                            </div>
                          </div>
                          <div className="mt-3 text-sm text-gray-700">
                            <p className="font-semibold">Call</p>
                            <a href={`tel:${bank.phone.replace(/\D/g, '')}`} className="text-red-700 hover:underline">
                              {bank.phone}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {results.map((bank) => (
                  <div key={bank.id} className="rounded-[20px] border border-gray-200 bg-gray-50 p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{bank.bankName}</h3>
                        <p className="mt-2 text-sm text-gray-600">{bank.address}</p>
                      </div>
                      <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                        {bank.distance} km
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Available units</p>
                        <p className="mt-2 text-2xl font-bold text-red-700">{bank.availableUnits}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="mt-2 text-sm text-gray-900">{bank.phone}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleSelectHospital(bank)}
                        className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                      >
                        View on Circle Map
                      </button>
                      <a
                        href={`tel:${bank.phone.replace(/\D/g, '')}`}
                        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Call Hospital
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default FindBloodBanks;
