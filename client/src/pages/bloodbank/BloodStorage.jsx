import { useState, useEffect } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaFlask, FaEdit, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BloodBankStorage = () => {
  const [bloodBags, setBloodBags] = useState([]);
  const [editingBag, setEditingBag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBloodBags();
  }, []);

  const loadBloodBags = async () => {
    try {
      const response = await bloodService.getInventory({ status: 'available' });
      setBloodBags(response.data.bloodBags || []);
    } catch (error) {
      console.error('Error loading blood bags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStorage = async (bagId, storageData) => {
    try {
      await bloodService.updateBloodBag(bagId, { storage: storageData });
      toast.success('Storage updated successfully');
      setEditingBag(null);
      loadBloodBags();
    } catch (error) {
      toast.error('Failed to update storage');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading blood storage...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Blood Storage Management</h2>

      {bloodBags.length === 0 ? (
        <div className="card text-center py-12">
          <FaFlask className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No blood bags in storage</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bloodBags.map((bag) => (
            <div key={bag._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-bold">
                  {bag.bloodGroup}
                </span>
                <span className="text-sm text-gray-500">{bag.bagId}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Component:</span>
                  <span className="font-medium">{bag.component.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-medium">{bag.volume}ml</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Collected:</span>
                  <span className="font-medium">{new Date(bag.collectionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-medium">{new Date(bag.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              {editingBag === bag._id ? (
                <div className="space-y-3 border-t pt-4">
                  <input
                    type="text"
                    placeholder="Refrigerator Number"
                    defaultValue={bag.storage?.refrigeratorNumber}
                    className="input-field text-sm"
                    id={`ref-${bag._id}`}
                  />
                  <input
                    type="text"
                    placeholder="Shelf Number"
                    defaultValue={bag.storage?.shelfNumber}
                    className="input-field text-sm"
                    id={`shelf-${bag._id}`}
                  />
                  <input
                    type="number"
                    placeholder="Temperature (°C)"
                    defaultValue={bag.storage?.temperature}
                    className="input-field text-sm"
                    id={`temp-${bag._id}`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStorage(bag._id, {
                        refrigeratorNumber: document.getElementById(`ref-${bag._id}`).value,
                        shelfNumber: document.getElementById(`shelf-${bag._id}`).value,
                        temperature: parseFloat(document.getElementById(`temp-${bag._id}`).value)
                      })}
                      className="btn-primary flex-1 text-sm"
                    >
                      <FaSave className="inline mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBag(null)}
                      className="btn-secondary flex-1 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4">
                  {bag.storage ? (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Refrigerator: {bag.storage.refrigeratorNumber}</p>
                      <p>Shelf: {bag.storage.shelfNumber}</p>
                      <p>Temperature: {bag.storage.temperature}°C</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No storage information</p>
                  )}
                  <button
                    onClick={() => setEditingBag(bag._id)}
                    className="btn-secondary w-full mt-3 text-sm"
                  >
                    <FaEdit className="inline mr-2" />
                    Update Storage
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBankStorage;
