const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  age: {
    type: Number
  },
  weight: {
    type: Number
  },
  bloodGroup: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  medicalHistory: {
    type: String
  },
  lastDonationDate: {
    type: Date
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  governmentId: {
    type: String
  },
  governmentIdType: {
    type: String,
    enum: ['aadhar', 'passport', 'driving_license', 'voter_id']
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  eligibilityReason: {
    type: String
  },
  badges: [{
    type: String,
    enum: ['first_hero', 'bronze_lifesaver', 'silver_lifesaver', 'gold_lifesaver', 'platinum_donor', 'legend_donor']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

donorSchema.index({ bloodGroup: 1, isEligible: 1 });
donorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donor', donorSchema);
