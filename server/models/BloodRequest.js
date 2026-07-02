const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true
  },
  unitsRequired: {
    type: Number,
    required: true
  },
  unitsAssigned: {
    type: Number,
    default: 0
  },
  emergencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  contactNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'partial', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedBloodBags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBag'
  }],
  notes: {
    type: String
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
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

bloodRequestSchema.index({ status: 1, emergencyLevel: 1 });
bloodRequestSchema.index({ bloodGroup: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
