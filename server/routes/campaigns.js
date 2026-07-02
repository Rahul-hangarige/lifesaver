const express = require('express');
const Campaign = require('../models/Campaign');
const FinancialDonation = require('../models/FinancialDonation');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create campaign (Admin)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all campaigns (Public)
router.get('/', async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const campaigns = await Campaign.find(query)
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('createdBy');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Get donations for this campaign
    const donations = await FinancialDonation.find({
      campaignId: req.params.id,
      status: 'completed'
    });

    res.json({ ...campaign.toObject(), donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update campaign (Admin)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    Object.keys(req.body).forEach(key => {
      campaign[key] = req.body[key];
    });

    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete campaign (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active campaigns
router.get('/active/list', async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('createdBy').sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
