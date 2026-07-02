const express = require('express');
const BloodRequest = require('../models/BloodRequest');
const BloodBag = require('../models/BloodBag');
const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');
const { auth, authorize } = require('../middleware/auth');
const sendNotification = require('../utils/sendNotification');

const router = express.Router();

// Create blood request (Hospital)
router.post('/', auth, authorize('hospital'), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    // Generate request ID
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const bloodRequest = new BloodRequest({
      requestId,
      hospitalId: hospital._id,
      ...req.body
    });

    await bloodRequest.save();

    // Update hospital total requests
    await Hospital.findByIdAndUpdate(hospital._id, {
      $inc: { totalRequests: 1 }
    });

    // Check available blood
    const availableBlood = await BloodBag.find({
      bloodGroup: req.body.bloodGroup,
      status: 'available',
      testStatus: 'approved'
    }).populate('bloodBankId');

    if (availableBlood.length > 0) {
      // Notify blood banks
      const io = req.app.get('io');
      for (const bag of availableBlood) {
        await sendNotification(
          io,
          bag.bloodBankId.userId,
          'bloodbank',
          'New Blood Request',
          `Emergency request for ${req.body.bloodGroup} blood`,
          'request',
          req.body.emergencyLevel === 'critical' ? 'urgent' : 'high',
          true,
          `/requests/${bloodRequest._id}`,
          bloodRequest._id
        );
      }
    } else {
      // Notify eligible donors
      const eligibleDonors = await Donor.find({
        bloodGroup: req.body.bloodGroup,
        isEligible: true
      }).populate('userId');

      const io = req.app.get('io');
      for (const donor of eligibleDonors) {
        await sendNotification(
          io,
          donor.userId._id,
          'donor',
          'Emergency Blood Request',
          `Urgent need for ${req.body.bloodGroup} blood at ${hospital.hospitalName}`,
          'emergency',
          'urgent',
          true,
          `/donate`,
          bloodRequest._id
        );
      }
    }

    res.status(201).json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hospital requests
router.get('/my', auth, authorize('hospital'), async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ userId: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const query = { hospitalId: hospital._id };

    if (status) query.status = status;

    const requests = await BloodRequest.find(query)
      .populate('assignedBloodBags')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ requestedDate: -1 });

    const total = await BloodRequest.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all requests (Admin/Blood Bank)
router.get('/', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const { status, bloodGroup, emergencyLevel, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (emergencyLevel) query.emergencyLevel = emergencyLevel;

    const requests = await BloodRequest.find(query)
      .populate('hospitalId')
      .populate('assignedBloodBags')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ requestedDate: -1 });

    const total = await BloodRequest.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get request by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('hospitalId')
      .populate('assignedBloodBags');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign blood bags to request (Blood Bank)
router.put('/:id/assign', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const { bloodBagIds } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update blood bags status
    await BloodBag.updateMany(
      { _id: { $in: bloodBagIds } },
      { status: 'reserved' }
    );

    // Update request
    bloodRequest.assignedBloodBags = bloodBagIds;
    bloodRequest.unitsAssigned = bloodBagIds.length;
    bloodRequest.status = bloodRequest.unitsAssigned >= bloodRequest.unitsRequired ? 'completed' : 'partial';
    bloodRequest.completedDate = bloodRequest.status === 'completed' ? new Date() : null;

    await bloodRequest.save();

    // Notify hospital
    const hospital = await Hospital.findById(bloodRequest.hospitalId).populate('userId');
    const io = req.app.get('io');
    await sendNotification(
      io,
      hospital.userId._id,
      'hospital',
      'Blood Assigned',
      `${bloodBagIds.length} unit(s) assigned to your request`,
      'request',
      'high',
      false,
      `/requests/${bloodRequest._id}`,
      bloodRequest._id
    );

    res.json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update request status
router.put('/:id/status', auth, authorize('admin', 'bloodbank', 'hospital'), async (req, res) => {
  try {
    const { status } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    bloodRequest.status = status;
    if (status === 'completed') {
      bloodRequest.completedDate = new Date();
    }

    await bloodRequest.save();
    res.json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
