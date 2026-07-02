const express = require('express');
const BloodBag = require('../models/BloodBag');
const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const FinancialDonation = require('../models/FinancialDonation');
const Certificate = require('../models/Certificate');
const { auth, authorize } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const router = express.Router();

// Generate daily donations report
router.get('/donations/daily', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    const donations = await BloodBag.find({
      collectionDate: {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      }
    }).populate('donorId').populate('bloodBankId');

    res.json({
      date: queryDate.toISOString().split('T')[0],
      total: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate monthly donations report
router.get('/donations/monthly', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const { year, month } = req.query;
    const queryYear = year ? parseInt(year) : new Date().getFullYear();
    const queryMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const startDate = new Date(queryYear, queryMonth - 1, 1);
    const endDate = new Date(queryYear, queryMonth, 0, 23, 59, 59);

    const donations = await BloodBag.find({
      collectionDate: { $gte: startDate, $lte: endDate }
    }).populate('donorId').populate('bloodBankId');

    const byBloodGroup = await BloodBag.aggregate([
      {
        $match: {
          collectionDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      year: queryYear,
      month: queryMonth,
      total: donations.length,
      byBloodGroup,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate blood inventory report
router.get('/inventory', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const bloodBankId = req.user.role === 'bloodbank'
      ? (await BloodBank.findOne({ userId: req.user._id }))._id
      : null;

    const query = bloodBankId ? { bloodBankId } : {};

    const inventory = await BloodBag.find(query)
      .populate('donorId')
      .populate('bloodBankId')
      .sort({ collectionDate: -1 });

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

    res.json({
      summary,
      total: inventory.length,
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate blood usage report
router.get('/usage', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.completedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const requests = await BloodRequest.find({
      status: 'completed',
      ...dateFilter
    }).populate('hospitalId').populate('assignedBloodBags');

    const byBloodGroup = await BloodRequest.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$unitsRequired' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total: requests.length,
      byBloodGroup,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate expired blood report
router.get('/expired', auth, authorize('admin', 'bloodbank'), async (req, res) => {
  try {
    const bloodBankId = req.user.role === 'bloodbank'
      ? (await BloodBank.findOne({ userId: req.user._id }))._id
      : null;

    const query = {
      status: 'expired',
      expiryDate: { $lte: new Date() }
    };

    if (bloodBankId) query.bloodBankId = bloodBankId;

    const expired = await BloodBag.find(query)
      .populate('donorId')
      .populate('bloodBankId')
      .sort({ expiryDate: -1 });

    res.json({
      total: expired.length,
      expired
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate hospital requests report
router.get('/hospital-requests', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.requestedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const requests = await BloodRequest.find(dateFilter)
      .populate('hospitalId')
      .sort({ requestedDate: -1 });

    const byHospital = await BloodRequest.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$hospitalId',
          totalRequests: { $sum: 1 },
          totalUnits: { $sum: '$unitsRequired' }
        }
      },
      {
        $lookup: {
          from: 'hospitals',
          localField: '_id',
          foreignField: '_id',
          as: 'hospital'
        }
      }
    ]);

    res.json({
      total: requests.length,
      byHospital,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate donor activity report
router.get('/donor-activity', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.collectionDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const donations = await BloodBag.find(dateFilter)
      .populate('donorId')
      .sort({ collectionDate: -1 });

    const topDonors = await Donor.aggregate([
      {
        $lookup: {
          from: 'bloodbags',
          localField: '_id',
          foreignField: 'donorId',
          as: 'donations'
        }
      },
      {
        $project: {
          userId: 1,
          bloodGroup: 1,
          totalDonations: { $size: '$donations' }
        }
      },
      { $sort: { totalDonations: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      total: donations.length,
      topDonors,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate certificates report
router.get('/certificates', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.issueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const certificates = await Certificate.find(dateFilter)
      .populate('donorId')
      .sort({ issueDate: -1 });

    res.json({
      total: certificates.length,
      certificates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate financial donations report
router.get('/financial-donations', auth, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate, campaignId } = req.query;

    const query = { status: 'completed' };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (campaignId) {
      query.campaignId = campaignId;
    }

    const donations = await FinancialDonation.find(query)
      .populate('campaignId')
      .sort({ createdAt: -1 });

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({
      total: donations.length,
      totalAmount,
      donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
