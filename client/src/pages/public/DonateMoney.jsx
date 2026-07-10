import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { campaignService } from '../../services/campaignService';
import { donationService } from '../../services/donationService';
import { FaHeart, FaHandHoldingHeart, FaQrcode } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DonateMoney = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    donorName: '',
    email: '',
    phone: '',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [upiLink, setUpiLink] = useState('');
  const [showUpi, setShowUpi] = useState(false);

  const presetAmounts = [100, 500, 1000, 5000, 10000];
  const locationOptions = ['Hyderabad', 'Bengaluru', 'Warangal', 'Hanmakonda'];

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getActiveCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || (Number(amount) <= 0)) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    if (!donorInfo.isAnonymous && (!donorInfo.donorName || !donorInfo.email)) {
      toast.error('Please fill all required fields or choose anonymous donation');
      return;
    }

    setLoading(true);
    try {
      await donationService.createDonation({
        amount: parseFloat(amount),
        campaignId: selectedCampaign,
        paymentMethod: 'upi',
        ...donorInfo,
      });
      toast.success('Thank you for your donation!');
      setAmount('');
      setDonorInfo({ donorName: '', email: '', phone: '', isAnonymous: false });
      setSelectedCampaign(null);
      setShowUpi(false);
      setUpiLink('');
    } catch (error) {
      toast.error('Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePhonePeScanner = () => {
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      toast.error('Enter a valid donation amount first');
      return;
    }

    const campaignTitle =
      campaigns.find((c) => c._id === selectedCampaign)?.title ||
      (locationOptions.includes(selectedCampaign)
        ? `Donation from ${selectedCampaign}`
        : 'General Fund');
    const upiId = 'lifesaver@upi';
    const payeeName = 'LifeSaver';
    const note = `Donation for ${campaignTitle}`;
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      tn: note,
      am: donationAmount.toFixed(2),
      cu: 'INR',
    });
    const link = `upi://pay?${params.toString()}`;
    setUpiLink(link);
    setShowUpi(true);
  };

  return (
    <div>
      <section className="page-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaHeart />
            Support Our Mission
          </h1>
          <p className="text-lg text-primary-100">Your financial support helps us save more lives</p>
        </div>
      </section>

      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Campaigns</h2>
            {campaigns.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">No active campaigns right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const progress = (campaign.raisedAmount / campaign.targetAmount) * 100;
                  return (
                    <div
                      key={campaign._id}
                      className={`card cursor-pointer transition-all ${
                        selectedCampaign === campaign._id
                          ? 'ring-2 ring-primary-500 border-primary-200'
                          : 'hover:border-gray-200'
                      }`}
                      onClick={() => setSelectedCampaign(campaign._id)}
                    >
                      <h3 className="font-bold text-lg mb-2">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-primary-600">
                          ₹{campaign.raisedAmount.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400">
                          of ₹{campaign.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card h-fit lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
            <form onSubmit={handleDonate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Campaign (Optional)
                </label>
                <select
                  value={selectedCampaign || ''}
                  onChange={(e) => setSelectedCampaign(e.target.value || null)}
                  className="input-field"
                >
                  <option value="">General Fund</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                  {campaigns.map((campaign) => (
                    <option key={campaign._id} value={campaign._id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount *
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        amount === preset.toString()
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Or enter custom amount"
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name {donorInfo.isAnonymous ? '(Optional)' : '*'}
                </label>
                <input
                  type="text"
                  value={donorInfo.donorName}
                  onChange={(e) => setDonorInfo({ ...donorInfo, donorName: e.target.value })}
                  className="input-field"
                  required={!donorInfo.isAnonymous}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email {donorInfo.isAnonymous ? '(Optional)' : '*'}
                </label>
                <input
                  type="email"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                  className="input-field"
                  required={!donorInfo.isAnonymous}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={donorInfo.isAnonymous}
                  onChange={(e) => setDonorInfo({ ...donorInfo, isAnonymous: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-600 text-sm">Make donation anonymous</span>
              </label>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={generatePhonePeScanner}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200/40 transition hover:bg-red-700"
                >
                  <FaQrcode />
                  Generate PhonePe QR
                </button>
              </div>
            </form>

            {showUpi && (
              <div className="mt-8 rounded-3xl border border-primary-200 bg-primary-50 p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scan to Pay with UPI</h3>
                <div className="inline-block rounded-2xl bg-white p-5 shadow-sm mb-4">
                  <QRCode value={upiLink} size={220} fgColor="#0f172a" bgColor="#ffffff" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Open PhonePe or any UPI app and scan the QR code below to complete your donation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateMoney;
