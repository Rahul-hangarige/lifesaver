const express = require('express');
const FinancialDonation = require('../models/FinancialDonation');
const Campaign = require('../models/Campaign');
const { auth, authorize } = require('../middleware/auth');
const sendNotification = require('../utils/sendNotification');

const router = express.Router();

// Create financial donation
router.post('/', async (req, res) => {
  try {
    const { amount, campaignId, paymentMethod, ...donorData } = req.body;

    // Generate donation ID
    const donationId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donation = new FinancialDonation({
      donationId,
      amount,
      campaignId,
      paymentMethod,
      transactionId: `TXN-${Date.now()}`,
      status: 'completed',
      ...donorData
    });

    await donation.save();

    // Update campaign
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        campaign.raisedAmount += amount;
        campaign.totalDonors += 1;
        await campaign.save();
      }
    }

    // Assign badge based on total donations
    const userDonations = await FinancialDonation.find({
      email: donorData.email,
      status: 'completed'
    });

    const totalAmount = userDonations.reduce((sum, d) => sum + d.amount, 0);
    let badge = 'supporter';
    if (totalAmount >= 10000) badge = 'bronze_sponsor';
    if (totalAmount >= 25000) badge = 'silver_sponsor';
    if (totalAmount >= 50000) badge = 'gold_sponsor';
    if (totalAmount >= 100000) badge = 'platinum_sponsor';
    if (totalAmount >= 500000) badge = 'lifesaver_champion';

    donation.badge = badge;
    await donation.save();

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all donations (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, campaignId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (campaignId) query.campaignId = campaignId;

    const donations = await FinancialDonation.find(query)
      .populate('campaignId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await FinancialDonation.countDocuments(query);

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await FinancialDonation.findById(req.params.id).populate('campaignId');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donation history by email
router.get('/history/:email', async (req, res) => {
  try {
    const donations = await FinancialDonation.find({
      email: req.params.email,
      status: 'completed'
    }).populate('campaignId').sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate certificate for financial donation
router.post('/:id/certificate', auth, authorize('admin'), async (req, res) => {
  try {
    const donation = await FinancialDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.certificateIssued) {
      return res.status(400).json({ message: 'Certificate already issued' });
    }

    const certificateNumber = `FCERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    donation.certificateNumber = certificateNumber;
    donation.certificateIssued = true;

    await donation.save();

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donation statistics (Admin)
router.get('/stats/summary', auth, authorize('admin'), async (req, res) => {
  try {
    const stats = await FinancialDonation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    const byCampaign = await FinancialDonation.aggregate([
      { $match: { status: 'completed', campaignId: { $ne: null } } },
      {
        $group: {
          _id: '$campaignId',
          totalAmount: { $sum: '$amount' },
          totalDonors: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'campaigns',
          localField: '_id',
          foreignField: '_id',
          as: 'campaign'
        }
      }
    ]);

    res.json({
      overall: stats[0] || { totalAmount: 0, totalDonations: 0, averageAmount: 0 },
      byCampaign
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
