require('dotenv').config();
const mongoose = require('mongoose');
const BloodBag = require('./models/BloodBag');
const BloodBank = require('./models/BloodBank');
const Donor = require('./models/Donor');
const User = require('./models/User');

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifesaver');
    console.log('Connected.');

    const query = {
      bloodGroup: 'O+',
      status: 'available',
      testStatus: 'approved'
    };

    console.log('Querying BloodBags...');
    const bags = await BloodBag.find(query).populate('bloodBankId');
    console.log(`Success: Found ${bags.length} bags.`);
  } catch (error) {
    console.error('Error during query:', error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
