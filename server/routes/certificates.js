const express = require('express');
const Certificate = require('../models/Certificate');
const BloodBag = require('../models/BloodBag');
const Donor = require('../models/Donor');
const { auth, authorize } = require('../middleware/auth');
const generateCertificate = require('../utils/generateCertificate');
const generateQRCode = require('../utils/generateQRCode');

const router = express.Router();

// Generate certificate (Blood Bank)
router.post('/', auth, authorize('bloodbank'), async (req, res) => {
  try {
    const { donationId } = req.body;
    const bloodBag = await BloodBag.findById(donationId).populate('donorId');

    if (!bloodBag) {
      return res.status(404).json({ message: 'Blood bag not found' });
    }

    const existingCertificate = await Certificate.findOne({ donationId });
    if (existingCertificate) {
      return res.status(400).json({ message: 'Certificate already generated' });
    }

    // Generate certificate number
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donor = await Donor.findById(bloodBag.donorId._id).populate('userId');
    const BloodBank = require('../models/BloodBank');
    const bloodBank = await BloodBank.findById(bloodBag.bloodBankId);

    const certificateData = {
      certificateNumber,
      donorName: donor.userId.name,
      donationDate: bloodBag.collectionDate,
      bloodGroup: bloodBag.bloodGroup,
      bloodBankName: bloodBank.bankName
    };

    // Generate PDF certificate
    const pdfPath = await generateCertificate(certificateData);

    // Generate QR code
    const qrData = {
      certificateNumber,
      donorName: donor.userId.name,
      bloodGroup: bloodBag.bloodGroup,
      donationDate: bloodBag.collectionDate
    };
    const qrCode = await generateQRCode(qrData);

    const certificate = new Certificate({
      certificateNumber,
      donorId: donor._id,
      donationId: bloodBag._id,
      donationDate: bloodBag.collectionDate,
      bloodGroup: bloodBag.bloodGroup,
      bloodBankName: bloodBank.bankName,
      qrCode
    });

    await certificate.save();

    // Update donor badges
    const totalDonations = donor.totalDonations;
    const badges = [];
    if (totalDonations >= 1) badges.push('first_hero');
    if (totalDonations >= 3) badges.push('bronze_lifesaver');
    if (totalDonations >= 5) badges.push('silver_lifesaver');
    if (totalDonations >= 10) badges.push('gold_lifesaver');
    if (totalDonations >= 20) badges.push('platinum_donor');
    if (totalDonations >= 50) badges.push('legend_donor');

    donor.badges = badges;
    await donor.save();

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get donor certificates
router.get('/my', auth, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    const certificates = await Certificate.find({ donorId: donor._id })
      .sort({ issueDate: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get certificate by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('donorId')
      .populate('donationId');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify certificate
router.get('/verify/:certificateNumber', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateNumber
    }).populate('donorId').populate('donationId');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({
      isValid: true,
      certificate: {
        donorName: certificate.donorId.userId?.name || 'Unknown',
        bloodGroup: certificate.bloodGroup,
        donationDate: certificate.donationDate,
        bloodBankName: certificate.bloodBankName,
        issueDate: certificate.issueDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download certificate
router.get('/:id/download', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const pdfPath = `certificates/${certificate.certificateNumber}.pdf`;
    res.download(pdfPath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
