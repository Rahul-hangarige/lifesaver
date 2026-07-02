const express = require('express');
const Hospital = require('../models/Hospital');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get hospital profile
router.get('/profile', auth, authorize('hospital'), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id }).populate('userId', '-password');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hospital profile
router.put('/profile', auth, authorize('hospital'), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    Object.keys(req.body).forEach(key => {
      hospital[key] = req.body[key];
    });

    await hospital.save();
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all hospitals (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { isApproved, page = 1, limit = 10 } = req.query;
    const query = {};

    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const hospitals = await Hospital.find(query)
      .populate('userId', '-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Hospital.countDocuments(query);

    res.json({
      hospitals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hospital by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('userId', '-password');
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve hospital (Admin)
router.put('/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    hospital.isApproved = true;
    await hospital.save();

    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby hospitals
router.get('/nearby/:coordinates', auth, async (req, res) => {
  try {
    const [lng, lat] = req.params.coordinates.split(',');
    const hospitals = await Hospital.find({
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

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
