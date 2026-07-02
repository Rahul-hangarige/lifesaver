const express = require('express');
const Donor = require('../models/Donor');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get donor profile
router.get('/profile', auth, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id }).populate('userId', '-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donor profile
router.put('/profile', auth, authorize('donor'), async (req, res) => {
  try {
    const allowedFields = ['bloodGroup', 'dateOfBirth', 'gender', 'weight', 'age', 'address', 'medicalHistory'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No donor profile fields provided for update.' });
    }

    const donor = await Donor.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', '-password');

    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all donors (Admin/Blood Bank)
router.get('/', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const { bloodGroup, isEligible, page = 1, limit = 10 } = req.query;
    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (isEligible !== undefined) query.isEligible = isEligible === 'true';

    const donors = await Donor.find(query)
      .populate('userId', '-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Donor.countDocuments(query);

    res.json({
      donors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('userId', '-password');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donor eligibility
router.put('/:id/eligibility', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const { isEligible, eligibilityReason } = req.body;
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    donor.isEligible = isEligible;
    donor.eligibilityReason = eligibilityReason;
    await donor.save();

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get eligible donors by blood group (for emergency)
router.get('/eligible/:bloodGroup', auth, authorize('admin', 'bloodbank', 'hospital'), async (req, res) => {
  try {
    const donors = await Donor.find({
      bloodGroup: req.params.bloodGroup,
      isEligible: true
    }).populate('userId', 'name phone email');

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
