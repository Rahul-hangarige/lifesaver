import { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { FaTint, FaCalendar, FaDownload } from 'react-icons/fa';

const DonorHistory = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await certificateService.getMyCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      const response = await certificateService.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading donation history...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Donation History</h2>

      {certificates.length === 0 ? (
        <div className="card text-center py-12">
          <FaTint className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No donations recorded yet</p>
          <p className="text-gray-500 mt-2">Your donation history will appear here after you donate blood</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert._id} className="card">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <FaTint className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{cert.bloodGroup} Blood Donation</p>
                    <div className="flex items-center space-x-4 text-gray-600 mt-1">
                      <FaCalendar className="text-sm" />
                      <span>{new Date(cert.donationDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {cert.bloodBankName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">
                    Cert: {cert.certificateNumber}
                  </p>
                  <button
                    onClick={() => handleDownload(cert._id)}
                    className="btn-primary text-sm"
                  >
                    <FaDownload className="inline mr-2" />
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600">{certificates.length}</p>
          <p className="text-gray-600">Total Donations</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-gray-900">
            {certificates.length * 3}
          </p>
          <p className="text-gray-600">Lives Potentially Saved</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-green-600">
            {certificates.length > 0 ? 'Active' : 'N/A'}
          </p>
          <p className="text-gray-600">Donor Status</p>
        </div>
      </div>
    </div>
  );
};

export default DonorHistory;
