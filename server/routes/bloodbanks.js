const express = require('express');
const BloodBank = require('../models/BloodBank');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get blood bank profile
router.get('/profile', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id }).populate('userId', '-password');
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }
    res.json(bloodBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blood bank profile
router.put('/profile', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    Object.keys(req.body).forEach(key => {
      bloodBank[key] = req.body[key];
    });

    await bloodBank.save();
    res.json(bloodBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all blood banks (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { isApproved, page = 1, limit = 10 } = req.query;
    const query = {};

    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const bloodBanks = await BloodBank.find(query)
      .populate('userId', '-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await BloodBank.countDocuments(query);

    res.json({
      bloodBanks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get approved blood banks (Public)
router.get('/approved/list', async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({ isApproved: true })
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });

    res.json(bloodBanks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood bank by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id).populate('userId', '-password');
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }
    res.json(bloodBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve blood bank (Admin)
router.put('/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }

    bloodBank.isApproved = true;
    await bloodBank.save();

    res.json(bloodBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby blood banks
router.get('/nearby/:coordinates', async (req, res) => {
  try {
    const [lng, lat] = req.params.coordinates.split(',');
    const bloodBanks = await BloodBank.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 50000 // 50km
        }
      },
      isApproved: true
    }).populate('userId', 'name phone email');

    res.json(bloodBanks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
