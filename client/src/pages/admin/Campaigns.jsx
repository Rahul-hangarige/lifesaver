import { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { FaBullhorn, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general_fund',
    targetAmount: 0,
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getCampaigns();
      setCampaigns(response.data.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await campaignService.updateCampaign(editingCampaign._id, formData);
        toast.success('Campaign updated');
      } else {
        await campaignService.createCampaign(formData);
        toast.success('Campaign created');
      }
      setShowForm(false);
      setEditingCampaign(null);
      setFormData({
        title: '',
        description: '',
        category: 'general_fund',
        targetAmount: 0,
        startDate: '',
        endDate: ''
      });
      loadCampaigns();
    } catch (error) {
      toast.error('Failed to save campaign');
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      targetAmount: campaign.targetAmount,
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignService.deleteCampaign(campaignId);
        toast.success('Campaign deleted');
        loadCampaigns();
      } catch (error) {
        toast.error('Failed to delete campaign');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading campaigns...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <FaPlus className="inline mr-2" />
          {showForm ? 'Cancel' : 'New Campaign'}
        </button>
      </div>

      {/* Campaign Form */}
      {showForm && (
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="blood_camp">Blood Camp</option>
                  <option value="equipment">Equipment</option>
                  <option value="emergency_transport">Emergency Transport</option>
                  <option value="patient_support">Patient Support</option>
                  <option value="general_fund">General Fund</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: parseInt(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="card text-center py-12">
          <FaBullhorn className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No campaigns found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(campaign)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(campaign._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2">{campaign.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Raised:</span>
                  <span className="font-bold text-green-600">₹{campaign.raisedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-bold">₹{campaign.targetAmount.toLocaleString()}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{campaign.totalDonors} donors</span>
                  <span>{Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCampaigns;
