const mongoose = require('mongoose');

const bloodBagSchema = new mongoose.Schema({
  bagId: {
    type: String,
    required: true,
    unique: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  bloodBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true
  },
  component: {
    type: String,
    enum: ['whole_blood', 'red_blood_cells', 'plasma', 'platelets', 'cryoprecipitate'],
    required: true
  },
  collectionDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  testResults: {
    hiv: { type: Boolean, default: false },
    hepatitisB: { type: Boolean, default: false },
    hepatitisC: { type: Boolean, default: false },
    malaria: { type: Boolean, default: false },
    syphilis: { type: Boolean, default: false },
    otherTests: String
  },
  testStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  storage: {
    refrigeratorNumber: String,
    shelfNumber: String,
    temperature: Number
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'issued', 'expired', 'discarded'],
    default: 'available'
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bloodBagSchema.index({ bloodGroup: 1, status: 1 });
bloodBagSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('BloodBag', bloodBagSchema);
