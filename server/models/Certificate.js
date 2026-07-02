const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBag',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  donationDate: {
    type: Date,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  bloodBankName: {
    type: String,
    required: true
  },
  qrCode: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
