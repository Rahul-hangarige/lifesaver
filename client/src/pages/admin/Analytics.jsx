import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminAnalytics = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [bloodDistribution, setBloodDistribution] = useState([]);
  const [campaignPerformance, setCampaignPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [monthlyRes, distributionRes, campaignRes] = await Promise.all([
        analyticsService.getMonthlyDonations(),
        analyticsService.getBloodDistribution(),
        analyticsService.getCampaignPerformance()
      ]);

      setMonthlyData(monthlyRes.data || []);
      setBloodDistribution(distributionRes.data || []);
      setCampaignPerformance(campaignRes.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyChartData = {
    labels: monthlyData.map(d => `${d._id.month}/${d._id.year}`),
    datasets: [{
      label: 'Donations',
      data: monthlyData.map(d => d.count),
      backgroundColor: 'rgba(220, 38, 38, 0.8)',
    }]
  };

  const bloodDistributionData = {
    labels: bloodDistribution.map(d => d._id),
    datasets: [{
      data: bloodDistribution.map(d => d.count),
      backgroundColor: [
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'
      ]
    }]
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Analytics Dashboard</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Donations Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Donations</h3>
          {monthlyData.length > 0 ? (
            <Bar data={monthlyChartData} options={{ responsive: true }} />
          ) : (
            <div className="text-center py-8 text-gray-600">No data available</div>
          )}
        </div>

        {/* Blood Distribution Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Blood Group Distribution</h3>
          {bloodDistribution.length > 0 ? (
            <Doughnut data={bloodDistributionData} options={{ responsive: true }} />
          ) : (
            <div className="text-center py-8 text-gray-600">No data available</div>
          )}
        </div>

        {/* Campaign Performance */}
        <div className="card lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Performance</h3>
          {campaignPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Campaign</th>
                    <th className="text-left py-3 px-4 font-semibold">Target</th>
                    <th className="text-left py-3 px-4 font-semibold">Raised</th>
                    <th className="text-left py-3 px-4 font-semibold">Progress</th>
                    <th className="text-left py-3 px-4 font-semibold">Donors</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((campaign, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">{campaign.title}</td>
                      <td className="py-3 px-4">₹{campaign.targetAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">₹{campaign.raisedAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-200 rounded-full h-2 w-24">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{campaign.progress.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{campaign.totalDonors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">No campaign data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
