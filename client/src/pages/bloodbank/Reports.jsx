import { useState } from 'react';
import { FaFileAlt, FaDownload } from 'react-icons/fa';

const BloodBankReports = () => {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const reportTypes = [
    { id: 'daily', name: 'Daily Donations', description: 'Report of donations for a specific day' },
    { id: 'monthly', name: 'Monthly Donations', description: 'Report of donations for a month' },
    { id: 'inventory', name: 'Blood Inventory', description: 'Current blood inventory status' },
    { id: 'usage', name: 'Blood Usage', description: 'Blood usage statistics' },
    { id: 'expired', name: 'Expired Blood', description: 'Report of expired blood units' }
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
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Reports</h2>

      {/* Report Selection */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`p-4 rounded-lg border-2 transition ${
                reportType === type.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaFileAlt className={reportType === type.id ? 'text-primary-600' : 'text-gray-400'} />
                <div className="text-left">
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
        <div className="flex justify-end">
          <button onClick={handleGenerateReport} className="btn-primary">
            <FaDownload className="inline mr-2" />
            Generate Report
          </button>
        </div>
      )}

      {/* Recent Reports */}
      <div className="card mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Daily Donations - Jan 15, 2024</p>
              <p className="text-sm text-gray-600">Generated on Jan 15, 2024</p>
            </div>
            <button className="btn-secondary text-sm">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Monthly Donations - January 2024</p>
              <p className="text-sm text-gray-600">Generated on Feb 1, 2024</p>
            </div>
            <button className="btn-secondary text-sm">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Blood Inventory - Current</p>
              <p className="text-sm text-gray-600">Generated on Feb 15, 2024</p>
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

export default BloodBankReports;
