import { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { FaTint, FaCalendar, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const HospitalHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await requestService.getMyRequests();
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FaCheckCircle;
      case 'pending': return FaClock;
      case 'cancelled': return FaTimesCircle;
      default: return FaTint;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading request history...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Request History</h2>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <FaTint className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            return (
              <div key={request._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <StatusIcon className="text-primary-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{request.patientName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Blood Group:</span>
                          <span className="font-medium ml-2">{request.bloodGroup}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Units:</span>
                          <span className="font-medium ml-2">
                            {request.unitsAssigned}/{request.unitsRequired}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Emergency:</span>
                          <span className="font-medium ml-2 capitalize">{request.emergencyLevel}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Request ID:</span>
                          <span className="font-medium ml-2">{request.requestId}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-500 text-sm mt-3">
                        <FaCalendar className="text-xs" />
                        <span>Requested: {new Date(request.requestedDate).toLocaleString()}</span>
                        {request.completedDate && (
                          <span>• Completed: {new Date(request.completedDate).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HospitalHistory;
