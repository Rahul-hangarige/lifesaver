import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { FaBullhorn, FaUsers, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

const featuredCampaigns = [
  {
    _id: 'warangal-blood-drive',
    title: 'Warangal Blood Awareness Campaign',
    description: 'A city-wide initiative bringing donors, hospitals, and volunteers together to boost emergency blood reserves in Warangal.',
    category: 'Community Outreach',
    location: 'Warangal, Telangana',
    tagline: 'A united push for emergency readiness.',
    accent: 'from-yellow-400 to-orange-500',
    raisedAmount: 480000,
    targetAmount: 600000,
    totalDonors: 320,
    startDate: '2024-08-01T00:00:00.000Z',
    endDate: '2024-09-05T00:00:00.000Z'
  },
  {
    _id: 'hanamkonda-health-drive',
    title: 'Hanamkonda Health & Blood Festival',
    description: 'An inspiring campaign offering free health checks, donor registrations, and a united push to keep our blood banks stocked.',
    category: 'Health Festival',
    location: 'Hanamkonda, Telangana',
    tagline: 'Empowering donors with wellness and compassion.',
    accent: 'from-green-400 to-emerald-500',
    raisedAmount: 350000,
    targetAmount: 500000,
    totalDonors: 250,
    startDate: '2024-08-10T00:00:00.000Z',
    endDate: '2024-09-10T00:00:00.000Z'
  },
  {
    _id: 'hyderabad-urgent-blood-drive',
    title: 'Hyderabad Emergency Blood Network',
    description: 'A high-impact campaign focused on meeting urgent demand across hospitals in Hyderabad with fast donor matching and awareness.',
    category: 'Emergency Support',
    location: 'Hyderabad, Telangana',
    tagline: 'Fast response blood support for the city.',
    accent: 'from-red-500 to-rose-600',
    raisedAmount: 620000,
    targetAmount: 750000,
    totalDonors: 415,
    startDate: '2024-08-05T00:00:00.000Z',
    endDate: '2024-09-20T00:00:00.000Z'
  },
  {
    _id: 'bengaluru-unite-for-life',
    title: 'Bengaluru Unite for Life',
    description: 'A premium donor drive in Bengaluru designed to inspire corporate participation and new donor registrations.',
    category: 'Corporate Outreach',
    location: 'Bengaluru, Karnataka',
    tagline: 'Corporate partners and donors joining for life-saving impact.',
    accent: 'from-indigo-500 to-violet-600',
    raisedAmount: 540000,
    targetAmount: 700000,
    totalDonors: 380,
    startDate: '2024-08-15T00:00:00.000Z',
    endDate: '2024-10-01T00:00:00.000Z'
  }
];

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getCampaigns({ status: 'active' });
      const loaded = response.data.campaigns || [];
      setCampaigns(loaded.length ? loaded : featuredCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setCampaigns(featuredCampaigns);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="page-hero bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaBullhorn className="text-white" />
            Campaigns that Change Cities
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-red-100/90">
            Explore powerful blood donation initiatives in Warangal, Hanamkonda, Hyderabad, and Bengaluru. Join the movement and help secure emergency blood supplies across the region.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Warangal', 'Hanamkonda', 'Hyderabad', 'Bengaluru'].map((city) => (
              <span key={city} className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-black/10">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="page-container">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="card text-center py-16 max-w-lg mx-auto">
            <FaBullhorn className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No active campaigns at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new initiatives.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
              return (
                <div key={campaign._id} className="card flex flex-col">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="badge bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs uppercase tracking-[0.18em] font-semibold">
                      {campaign.category.replace(/_/g, ' ')}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      <FaMapMarkerAlt className="text-primary-600" />
                      {campaign.location || 'Regional Campaign'}
                    </span>
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-gray-900">{campaign.title}</h3>
                  <p className="text-gray-600 mb-6 min-h-[70px]">{campaign.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Raised</span>
                      <span className="font-bold text-primary-600">
                        ₹{campaign.raisedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target</span>
                      <span className="font-semibold">₹{campaign.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-primary-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-primary-500" />
                        {campaign.totalDonors} donors
                      </span>
                      <span className="font-medium text-primary-600">{Math.round(progress)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5 text-sm text-gray-500">
                    <div className="flex items-center gap-2 rounded-2xl bg-gray-50 p-3">
                      <FaCalendar className="text-primary-500" />
                      <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-gray-50 p-3">
                      <FaCalendar className="text-primary-500" />
                      <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link to="/donate-money" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200/40 transition hover:from-red-700 hover:to-pink-700 mt-auto">
                    Donate Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
