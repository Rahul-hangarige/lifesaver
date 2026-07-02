const mongoose = require('mongoose');

const financialDonationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    required: true,
    unique: true
  },
  donorName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'],
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateNumber: {
    type: String
  },
  badge: {
    type: String,
    enum: ['supporter', 'bronze_sponsor', 'silver_sponsor', 'gold_sponsor', 'platinum_sponsor', 'lifesaver_champion']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

financialDonationSchema.index({ status: 1 });

module.exports = mongoose.model('FinancialDonation', financialDonationSchema);
