const express = require('express');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodBank = require('../models/BloodBank');
const BloodBag = require('../models/BloodBag');
const BloodRequest = require('../models/BloodRequest');
const FinancialDonation = require('../models/FinancialDonation');
const Campaign = require('../models/Campaign');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get overall analytics (Admin)
router.get('/overview', auth, authorize('admin'), async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const activeHospitals = await Hospital.countDocuments({ isApproved: true });
    const activeBloodBanks = await BloodBank.countDocuments({ isApproved: true });

    const bloodStats = await BloodBag.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const bloodAvailable = bloodStats.find(s => s._id === 'available')?.count || 0;
    const bloodIssued = bloodStats.find(s => s._id === 'issued')?.count || 0;
    const bloodExpired = bloodStats.find(s => s._id === 'expired')?.count || 0;

    const emergencyRequests = await BloodRequest.countDocuments({
      emergencyLevel: { $in: ['high', 'critical'] },
      status: { $in: ['pending', 'processing'] }
    });

    const moneyRaised = await FinancialDonation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });

    // Estimate lives supported (assuming 1 unit saves 1 life)
    const livesSupported = bloodIssued;

    res.json({
      totalDonors,
      activeHospitals,
      activeBloodBanks,
      bloodAvailable,
      bloodIssued,
      bloodExpired,
      emergencyRequests,
      moneyRaised: moneyRaised[0]?.total || 0,
      activeCampaigns,
      livesSupported
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly donations chart data
router.get('/donations/monthly', auth, authorize('admin'), async (req, res) => {
  try {
    const monthlyData = await BloodBag.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$collectionDate' },
            month: { $month: '$collectionDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood group distribution
router.get('/blood/distribution', auth, authorize('admin'), async (req, res) => {
  try {
    const distribution = await BloodBag.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood bank specific analytics
router.get('/bloodbank/stats', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    const inventory = await BloodBag.aggregate([
      { $match: { bloodBankId: bloodBank._id } },
      {
        $group: {
          _id: '$bloodGroup',
          available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
          reserved: { $sum: { $cond: [{ $eq: ['$status', 'reserved'] }, 1, 0] } },
          issued: { $sum: { $cond: [{ $eq: ['$status', 'issued'] }, 1, 0] } }
        }
      }
    ]);

    const todayAppointments = await Appointment.countDocuments({
      bloodBankId: bloodBank._id,
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    const pendingRequests = await BloodRequest.countDocuments({
      status: 'pending'
    });

    res.json({
      inventory,
      todayAppointments,
      pendingRequests,
      totalDonations: bloodBank.totalDonations,
      totalIssued: bloodBank.totalIssued
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get campaign performance
router.get('/campaigns/performance', auth, authorize('admin'), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' })
      .sort({ raisedAmount: -1 })
      .limit(10);

    const performance = await Promise.all(
      campaigns.map(async (campaign) => {
        const donations = await FinancialDonation.countDocuments({
          campaignId: campaign._id,
          status: 'completed'
        });

        return {
          title: campaign.title,
          targetAmount: campaign.targetAmount,
          raisedAmount: campaign.raisedAmount,
          progress: (campaign.raisedAmount / campaign.targetAmount) * 100,
          totalDonors: donations
        };
      })
    );

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donor statistics
router.get('/donor/stats', auth, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const nextEligibleDate = donor.lastDonationDate
      ? new Date(new Date(donor.lastDonationDate).setDate(new Date(donor.lastDonationDate).getDate() + 90))
      : null;

    res.json({
      totalDonations: donor.totalDonations,
      bloodGroup: donor.bloodGroup,
      isEligible: donor.isEligible,
      eligibilityReason: donor.eligibilityReason,
      lastDonationDate: donor.lastDonationDate,
      nextEligibleDate,
      badges: donor.badges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
