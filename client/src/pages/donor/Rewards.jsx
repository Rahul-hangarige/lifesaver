import { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { FaAward, FaMedal, FaTrophy, FaStar } from 'react-icons/fa';

const DonorRewards = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const badges = [
    { key: 'first_hero', icon: FaStar, name: 'First Hero', description: 'Completed first donation', color: 'from-yellow-400 to-yellow-600' },
    { key: 'bronze_lifesaver', icon: FaMedal, name: 'Bronze Lifesaver', description: '3 donations', color: 'from-orange-400 to-orange-600' },
    { key: 'silver_lifesaver', icon: FaMedal, name: 'Silver Lifesaver', description: '5 donations', color: 'from-gray-300 to-gray-500' },
    { key: 'gold_lifesaver', icon: FaTrophy, name: 'Gold Lifesaver', description: '10 donations', color: 'from-yellow-300 to-yellow-500' },
    { key: 'platinum_donor', icon: FaAward, name: 'Platinum Donor', description: '20 donations', color: 'from-gray-400 to-gray-600' },
    { key: 'legend_donor', icon: FaTrophy, name: 'Legend Donor', description: '50 donations', color: 'from-purple-400 to-purple-600' }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await donorService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading rewards...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">My Rewards & Badges</h2>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600">{profile?.totalDonations || 0}</p>
          <p className="text-gray-600">Total Donations</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-yellow-600">{profile?.badges?.length || 0}</p>
          <p className="text-gray-600">Badges Earned</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-green-600">
            {profile?.isEligible ? 'Yes' : 'No'}
          </p>
          <p className="text-gray-600">Eligible to Donate</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Achievement Badges</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const isEarned = profile?.badges?.includes(badge.key);
            const Icon = badge.icon;

            return (
              <div
                key={badge.key}
                className={`card ${isEarned ? '' : 'opacity-50 grayscale'} transition-all`}
              >
                <div className={`bg-gradient-to-br ${badge.color} text-white p-6 rounded-lg mb-4`}>
                  <Icon className="text-4xl mx-auto" />
                </div>
                <h4 className="font-bold text-lg text-center mb-2">{badge.name}</h4>
                <p className="text-gray-600 text-center text-sm">{badge.description}</p>
                {isEarned && (
                  <div className="mt-4 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Earned
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress to Next Badge */}
      {profile && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Progress to Next Badge</h3>
          <div className="space-y-4">
            {badges.map((badge, index) => {
              const isEarned = profile.badges?.includes(badge.key);
              const nextBadge = badges[index + 1];
              const donationsNeeded = nextBadge ? [3, 5, 10, 20, 50][index] - profile.totalDonations : 0;

              if (isEarned && nextBadge) {
                return (
                  <div key={badge.key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Next: {nextBadge.name}</span>
                      <span className="text-gray-600">{donationsNeeded} more donations</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((profile.totalDonations / [3, 5, 10, 20, 50][index]) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {profile.totalDonations >= 50 && (
            <div className="text-center mt-6">
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-bold">
                🎉 You've earned all badges! You're a Legend!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonorRewards;
