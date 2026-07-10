const mongoose = require('mongoose');

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017');
    console.log('Connected.');

    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const dbs = await admin.listDatabases();
    console.log('Databases:');
    console.log(JSON.stringify(dbs, null, 2));
  } catch (error) {
    console.error('Error listing databases:', error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
