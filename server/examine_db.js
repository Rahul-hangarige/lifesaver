require('dotenv').config();
const mongoose = require('mongoose');

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifesaver');
    console.log('Connected.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Actual Collections in MongoDB:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }

    console.log('\nSample from bloodbags:');
    const bags = await mongoose.connection.db.collection('bloodbags').find({}).limit(2).toArray();
    console.log(JSON.stringify(bags, null, 2));

    console.log('\nSample from bloodbanks:');
    const banks = await mongoose.connection.db.collection('bloodbanks').find({}).limit(2).toArray();
    console.log(JSON.stringify(banks, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
