const express = require('express');
const BloodBag = require('../models/BloodBag');
const BloodBank = require('../models/BloodBank');
const Donor = require('../models/Donor');
const { auth, authorize } = require('../middleware/auth');
const generateQRCode = require('../utils/generateQRCode');

const router = express.Router();

// Add blood bag (Blood Bank only)
router.post('/', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const bloodBag = new BloodBag({
      ...req.body,
      bloodBankId: bloodBank._id
    });

    // Generate QR code
    const qrData = {
      bagId: bloodBag.bagId,
      bloodGroup: bloodBag.bloodGroup,
      component: bloodBag.component
    };
    bloodBag.qrCode = await generateQRCode(qrData);

    await bloodBag.save();

    // Update donor total donations
    await Donor.findByIdAndUpdate(bloodBag.donorId, {
      $inc: { totalDonations: 1 },
      lastDonationDate: bloodBag.collectionDate
    });

    // Update blood bank total donations
    await BloodBank.findByIdAndUpdate(bloodBank._id, {
      $inc: { totalDonations: 1 }
    });

    res.status(201).json(bloodBag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood inventory (Blood Bank)
router.get('/inventory', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const { bloodGroup, component, status, page = 1, limit = 10 } = req.query;
    const query = { bloodBankId: bloodBank._id };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (component) query.component = component;
    if (status) query.status = status;

    const bloodBags = await BloodBag.find(query)
      .populate('donorId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ collectionDate: -1 });

    const total = await BloodBag.countDocuments(query);

    res.json({
      bloodBags,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blood by blood group (Public)
router.get('/available/:bloodGroup', async (req, res) => {
  try {
    const { component } = req.query;
    const query = {
      bloodGroup: req.params.bloodGroup,
      status: 'available',
      testStatus: 'approved'
    };

    if (component) query.component = component;

    const bloodBags = await BloodBag.find(query)
      .populate('bloodBankId')
      .sort({ expiryDate: 1 });

    res.json(bloodBags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blood bag details
router.put('/:id', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBag = await BloodBag.findById(req.params.id);
    if (!bloodBag) {
      return res.status(404).json({ message: 'Blood bag not found' });
    }

    Object.keys(req.body).forEach(key => {
      bloodBag[key] = req.body[key];
    });

    await bloodBag.save();
    res.json(bloodBag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update test results
router.put('/:id/tests', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const { testResults, testStatus } = req.body;
    const bloodBag = await BloodBag.findById(req.params.id);

    if (!bloodBag) {
      return res.status(404).json({ message: 'Blood bag not found' });
    }

    bloodBag.testResults = { ...bloodBag.testResults, ...testResults };
    bloodBag.testStatus = testStatus;

    await bloodBag.save();
    res.json(bloodBag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update blood bag status
router.put('/:id/status', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const { status } = req.body;
    const bloodBag = await BloodBag.findById(req.params.id);

    if (!bloodBag) {
      return res.status(404).json({ message: 'Blood bag not found' });
    }

    bloodBag.status = status;

    if (status === 'issued') {
      const BloodBank = require('../models/BloodBank');
      await BloodBank.findByIdAndUpdate(bloodBag.bloodBankId, {
        $inc: { totalIssued: 1 }
      });
    }

    await bloodBag.save();
    res.json(bloodBag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expiring blood bags (Blood Bank)
router.get('/expiring/alert', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne({ userId: req.user._id });
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank profile not found' });
    }

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringBags = await BloodBag.find({
      bloodBankId: bloodBank._id,
      status: 'available',
      testStatus: 'approved',
      expiryDate: { $lte: threeDaysFromNow }
    }).populate('donorId');

    res.json(expiringBags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory summary (Admin/Blood Bank)
router.get('/summary/stats', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const bloodBankId = req.user.role === 'bloodbank' 
      ? (await BloodBank.findOne({ userId: req.user._id }))._id 
      : null;

    const query = bloodBankId ? { bloodBankId } : {};

    const summary = await BloodBag.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$bloodGroup',
          available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
          reserved: { $sum: { $cond: [{ $eq: ['$status', 'reserved'] }, 1, 0] } },
          issued: { $sum: { $cond: [{ $eq: ['$status', 'issued'] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
