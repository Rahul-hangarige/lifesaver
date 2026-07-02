import { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { FaAward, FaDownload, FaQrcode } from 'react-icons/fa';

const DonorCertificates = () => {
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
      console.error('Error loading certificates:', error);
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
    return <div className="text-center py-12">Loading certificates...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">My Certificates</h2>

      {certificates.length === 0 ? (
        <div className="card text-center py-12">
          <FaCertificate className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No certificates yet</p>
          <p className="text-gray-500 mt-2">Certificates are generated after each verified donation</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="card">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <FaCertificate className="text-3xl" />
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">
                    Verified
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2">Certificate of Appreciation</h3>
                <p className="text-primary-100 text-sm">{cert.bloodGroup} Blood Donation</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Certificate No:</span>
                  <span className="font-medium">{cert.certificateNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Donation Date:</span>
                  <span className="font-medium">{new Date(cert.donationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Blood Group:</span>
                  <span className="font-medium">{cert.bloodGroup}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Issued By:</span>
                  <span className="font-medium text-right text-sm">{cert.bloodBankName}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(cert._id)}
                  className="btn-primary flex-1 text-sm"
                >
                  <FaDownload className="inline mr-2" />
                  Download
                </button>
                {cert.qrCode && (
                  <button className="btn-secondary flex-1 text-sm">
                    <FaQrcode className="inline mr-2" />
                    View QR
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorCertificates;
