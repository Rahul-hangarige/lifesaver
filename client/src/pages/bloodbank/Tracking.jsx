import { useState } from 'react';
import { FaQrcode, FaSearch } from 'react-icons/fa';

const BloodBankTracking = () => {
  const [bagId, setBagId] = useState('');
  const [bagInfo, setBagInfo] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!bagId) return;

    // Simulated search - in real app, this would call an API
    setBagInfo({
      bagId: bagId,
      bloodGroup: 'O+',
      component: 'Whole Blood',
      donorId: 'DON-12345',
      collectionDate: '2024-01-15',
      expiryDate: '2024-02-15',
      testStatus: 'approved',
      status: 'available',
      storage: {
        refrigeratorNumber: 'RF-001',
        shelfNumber: 'SH-02',
        temperature: 4
      }
    });
    setSearched(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Blood Bag Tracking</h2>

      {/* Search Form */}
      <div className="card max-w-2xl mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Bag ID
            </label>
            <input
              type="text"
              value={bagId}
              onChange={(e) => setBagId(e.target.value)}
              className="input-field"
              placeholder="Enter blood bag ID"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <FaSearch className="inline mr-2" />
            Search Blood Bag
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && bagInfo && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Blood Bag Details</h3>
            <button className="btn-secondary">
              <FaQrcode className="inline mr-2" />
              View QR Code
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Bag ID:</span>
                <span className="font-medium">{bagInfo.bagId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Blood Group:</span>
                <span className="font-bold text-primary-600">{bagInfo.bloodGroup}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Component:</span>
                <span className="font-medium">{bagInfo.component}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Donor ID:</span>
                <span className="font-medium">{bagInfo.donorId}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Collection Date:</span>
                <span className="font-medium">{bagInfo.collectionDate}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Expiry Date:</span>
                <span className="font-medium">{bagInfo.expiryDate}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Test Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bagInfo.testStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {bagInfo.testStatus.charAt(0).toUpperCase() + bagInfo.testStatus.slice(1)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bagInfo.status === 'available' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {bagInfo.status.charAt(0).toUpperCase() + bagInfo.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Storage Information */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Storage Information</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Refrigerator:</span>
                <p className="font-medium">{bagInfo.storage.refrigeratorNumber}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Shelf:</span>
                <p className="font-medium">{bagInfo.storage.shelfNumber}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Temperature:</span>
                <p className="font-medium">{bagInfo.storage.temperature}°C</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankTracking;
