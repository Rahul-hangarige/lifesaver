import { useState, useEffect } from 'react';
import { bloodService } from '../../services/bloodService';
import { FaBox } from 'react-icons/fa';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await bloodService.getSummary();
      setInventory(response.data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading inventory...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Blood Inventory Overview</h2>

      {inventory.length === 0 ? (
        <div className="card text-center py-12">
          <FaBox className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No inventory data available</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.map((item) => (
            <div key={item._id} className="card">
              <div className="text-center mb-4">
                <span className="bg-primary-100 text-primary-600 px-4 py-2 rounded-full font-bold text-2xl">
                  {item._id}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available</span>
                  <span className="font-bold text-green-600">{item.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reserved</span>
                  <span className="font-bold text-yellow-600">{item.reserved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Issued</span>
                  <span className="font-bold text-blue-600">{item.issued}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expired</span>
                  <span className="font-bold text-red-600">{item.expired}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total</span>
                    <span className="font-bold">{item.available + item.reserved + item.issued + item.expired}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
