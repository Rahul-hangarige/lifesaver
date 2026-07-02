import { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { FaAward, FaSearch } from 'react-icons/fa';

const AdminCertificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const response = await certificateService.verifyCertificate(searchTerm);
      setVerificationResult(response.data);
      setSearched(true);
    } catch (error) {
      setVerificationResult({ isValid: false });
      setSearched(true);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Certificate Verification</h2>

      {/* Verification Form */}
      <div className="card max-w-2xl mb-8">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Number
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              placeholder="Enter certificate number (e.g., CERT-1234567890-ABCDEF)"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <FaSearch className="inline mr-2" />
            Verify Certificate
          </button>
        </form>
      </div>

      {/* Verification Result */}
      {searched && (
        <div className={`card ${verificationResult?.isValid ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Verification Result</h3>
            <span className={`px-3 py-1 rounded-full font-medium ${
              verificationResult?.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {verificationResult?.isValid ? 'Valid Certificate' : 'Invalid Certificate'}
            </span>
          </div>

          {verificationResult?.isValid && verificationResult.certificate ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Donor Name:</span>
                  <span className="font-medium">{verificationResult.certificate.donorName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Blood Group:</span>
                  <span className="font-bold text-primary-600">{verificationResult.certificate.bloodGroup}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Donation Date:</span>
                  <span className="font-medium">{new Date(verificationResult.certificate.donationDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Blood Bank:</span>
                  <span className="font-medium">{verificationResult.certificate.bloodBankName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium">{new Date(verificationResult.certificate.issueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <FaCertificate className="text-gray-400 text-5xl mx-auto mb-4" />
              <p>This certificate could not be verified. Please check the certificate number and try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
