import { useState } from 'react';
import { FaFile, FaDownload } from 'react-icons/fa';

const AdminReports = () => {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const reportTypes = [
    { id: 'daily_donations', name: 'Daily Donations', description: 'Report of donations for a specific day' },
    { id: 'monthly_donations', name: 'Monthly Donations', description: 'Report of donations for a month' },
    { id: 'inventory', name: 'Blood Inventory', description: 'Current blood inventory status across all blood banks' },
    { id: 'usage', name: 'Blood Usage', description: 'Blood usage statistics and trends' },
    { id: 'expired', name: 'Expired Blood', description: 'Report of expired blood units' },
    { id: 'hospital_requests', name: 'Hospital Requests', description: 'Blood requests from hospitals' },
    { id: 'donor_activity', name: 'Donor Activity', description: 'Donor participation and activity' },
    { id: 'certificates', name: 'Certificates Issued', description: 'Report of all issued certificates' },
    { id: 'financial_donations', name: 'Financial Donations', description: 'Report of monetary donations' }
  ];

  const handleGenerateReport = () => {
    if (!reportType) {
      alert('Please select a report type');
      return;
    }
    // In real app, this would call API to generate report
    alert(`Generating ${reportType} report...`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">System Reports</h2>

      {/* Report Selection */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                reportType === type.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaFileAlt className={reportType === type.id ? 'text-primary-600' : 'text-gray-400'} />
                <div>
                  <p className="font-semibold">{type.name}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Selection */}
      {reportType && (
        <div className="card mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Date Range</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {reportType && (
        <div className="flex justify-end mb-8">
          <button onClick={handleGenerateReport} className="btn-primary">
            <FaDownload className="inline mr-2" />
            Generate Report
          </button>
        </div>
      )}

      {/* Recent Reports */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Daily Donations - Jan 15, 2024</p>
              <p className="text-sm text-gray-600">Generated on Jan 15, 2024 at 5:30 PM</p>
            </div>
            <button className="btn-secondary text-sm">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Monthly Donations - January 2024</p>
              <p className="text-sm text-gray-600">Generated on Feb 1, 2024 at 10:00 AM</p>
            </div>
            <button className="btn-secondary text-sm">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Blood Inventory - All Blood Banks</p>
              <p className="text-sm text-gray-600">Generated on Feb 15, 2024 at 2:15 PM</p>
            </div>
            <button className="btn-secondary text-sm">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Financial Donations - Q4 2023</p>
              <p className="text-sm text-gray-600">Generated on Jan 5, 2024 at 9:00 AM</p>
            </div>
            <button className="btn-secondary text-sm">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
