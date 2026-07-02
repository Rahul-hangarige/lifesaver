import { useState, useEffect, useMemo } from 'react';
import { requestService } from '../../services/requestService';
import { FaClipboardList, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHospital } from 'react-icons/fa';
import toast from 'react-hot-toast';

const bloodGroups = ['all', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const preferredHospitals = {
  Hyderabad: 'NIMS',
  Warangal: 'Ganga Hospital',
  Hanmakonda: 'Samraksha Hospital',
  Kazipet: 'Azara Hospital',
};

const getSeverity = (level) => {
  const normalized = (level || '').toLowerCase();
  if (normalized === 'critical') return { label: 'Critical', badge: 'bg-red-100 text-red-800' };
  if (normalized === 'urgent' || normalized === 'high') return { label: 'Urgent', badge: 'bg-orange-100 text-orange-800' };
  return { label: 'Normal', badge: 'bg-green-100 text-green-800' };
};

const BloodRequestCard = ({ request, preferredHospital, onUpdateStatus }) => {
  const severity = getSeverity(request.emergencyLevel);
  const hospitalLocation = request.hospitalId?.location || request.hospitalId?.address || '';
  const emailAddress = request.contactEmail || request.email || '';
  const phoneNumber = request.contactNumber || '';
  const mapQuery = preferredHospital || hospitalLocation || request.hospitalId?.hospitalName || '';

  return (
    <article className="group flex h-full flex-col rounded-[16px] border border-[#E0E0E0] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[28px] font-bold text-black">{request.bloodGroup}</span>
            <span className="text-sm font-medium text-red-600">Needed</span>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${severity.badge}`}>
          {severity.label}
        </span>
      </div>

      <div className="mt-6 flex-1">
        <h3 className="text-xl font-bold text-gray-900">{request.patientName}</h3>
        {request.hospitalId?.hospitalName && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <FaHospital className="text-gray-400" />
            <span>{request.hospitalId.hospitalName}</span>
          </div>
        )}
        {hospitalLocation && <p className="mt-2 text-sm text-gray-500">{hospitalLocation}</p>}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[12px] border border-[#E0E0E0] bg-[#F5F7FA] p-4">
            <p className="text-sm text-gray-500">Units Required</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{request.unitsRequired}</p>
          </div>
          <div className="rounded-[12px] border border-[#E0E0E0] bg-[#F5F7FA] p-4">
            <p className="text-sm text-gray-500">Assigned</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{request.unitsAssigned || 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => phoneNumber && (window.location.href = `tel:${phoneNumber}`)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#2E7D32] px-4 text-sm font-semibold text-white transition hover:bg-[#265d28] focus:outline-none focus:ring-2 focus:ring-[#2E7D3299]"
          aria-label={`Call ${phoneNumber || 'contact'}`}>
          <FaPhone />
          Call
        </button>
        <button
          type="button"
          onClick={() => emailAddress && (window.location.href = `mailto:${emailAddress}`)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#2196F3] px-4 text-sm font-semibold text-white transition hover:bg-[#1c7ad1] focus:outline-none focus:ring-2 focus:ring-[#2196F399]"
          aria-label={`Email ${emailAddress || 'contact'}`}>
          <FaEnvelope />
          Email
        </button>
        <button
          type="button"
          onClick={() => mapQuery && window.open(`https://www.google.com/maps/search/${encodeURIComponent(mapQuery)}`, '_blank')}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#795548] px-4 text-sm font-semibold text-white transition hover:bg-[#5f4138] focus:outline-none focus:ring-2 focus:ring-[#79554899]"
          aria-label="Open map">
          <FaMapMarkerAlt />
          Map
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={() => onUpdateStatus(request._id, 'completed')}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F5F7FA] px-4 text-sm font-semibold text-black transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]"
          aria-label="Mark request received">
          Mark Received
        </button>
        <button
          type="button"
          onClick={() => toast.success(`Request code: ${request._id}`)}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#2196F3] to-[#1976D2] px-4 text-sm font-semibold text-white shadow-sm transition duration-300 hover:shadow-md hover:from-[#1976D2] hover:to-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#2196F399]"
          aria-label="Show request code">
          Show Code
        </button>
      </div>
    </article>
  );
};

const BloodBankRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [locationQuery, setLocationQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const locations = ['Hyderabad', 'Warangal', 'Hanmakonda', 'Kazipet'];
  const preferredLocation = locations.find((loc) => locationQuery.toLowerCase().includes(loc.toLowerCase())) || 'Hyderabad';

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    try {
      const response = await requestService.getAllRequests({ status: statusFilter });
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const groupMatch = bloodGroupFilter === 'all' || request.bloodGroup === bloodGroupFilter;
      const hospitalText = `${request.hospitalId?.hospitalName || ''} ${request.hospitalId?.location || ''}`.toLowerCase();
      const locationMatch = locationQuery.trim() === '' || hospitalText.includes(locationQuery.trim().toLowerCase());
      return groupMatch && locationMatch;
    });
  }, [requests, bloodGroupFilter, locationQuery]);

  const clearFilters = () => {
    setBloodGroupFilter('all');
    setLocationQuery('');
  };

  const applyFilters = () => {};

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await requestService.updateStatus(requestId, status);
      toast.success('Status updated successfully');
      loadRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading requests...</div>;
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blood Requests</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">Manage incoming blood requests with a cleaner, modern layout built for fast review.</p>
        </div>
        <div className="grid w-full gap-3 md:w-auto md:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_auto_auto]">
          <div>
            <label htmlFor="blood-group-filter" className="sr-only">Blood Group</label>
            <select
              id="blood-group-filter"
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="h-12 w-full rounded-[12px] border border-[#E0E0E0] bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F333]"
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group === 'all' ? 'All Blood Groups' : group}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="location-search" className="sr-only">Location search</label>
            <input
              id="location-search"
              type="search"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location search"
              className="h-12 w-full rounded-[12px] border border-[#E0E0E0] bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F333]"
            />
          </div>
          <button
            type="button"
            onClick={applyFilters}
            className="h-12 rounded-[12px] bg-gradient-to-r from-[#2196F3] to-[#1976D2] px-5 text-sm font-semibold text-white transition hover:from-[#1976D2] hover:to-[#1565C0]"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="h-12 rounded-[12px] border border-[#E0E0E0] bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[16px] border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Preferred Hospital</h3>
          <p className="text-gray-600">Requests from your selected location will be routed to the preferred hospital below.</p>
          <div className="mt-4 rounded-[12px] bg-[#F5F7FA] p-4 text-sm text-gray-700">
            {preferredHospitals[preferredLocation]}
          </div>
        </div>
        <div className="rounded-[16px] border border-[#E0E0E0] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Nearby Search Radius</h3>
          <p className="text-gray-600">Blood requests displayed are within a 5–20 km radius of the hospital location.</p>
          <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#F5F7FA] p-4 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-gray-500" />
            <span>5 to 20 km range</span>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="rounded-[16px] border border-[#E0E0E0] bg-white p-10 text-center shadow-sm">
          <FaClipboardList className="mx-auto mb-4 text-5xl text-gray-400" />
          <p className="text-gray-600 text-lg">No matching blood requests found.</p>
          <p className="text-gray-500 mt-2">Adjust the filters above to find more requests.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRequests.map((request) => (
            <BloodRequestCard
              key={request._id}
              request={request}
              preferredHospital={preferredHospitals[preferredLocation]}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBankRequests;
