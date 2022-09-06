const {mongoose} = require('mongoose');

const options = {
  autoIndex: false,
  keepAlive: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  keepAliveInitialDelay: 300000
};

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_CLUSTER_SUFFIX}`;
module.exports = mongoose.connect(uri , options, error => {
    if (error) {
      console.error('Unable to connect to the database:', error);
    } else {
      console.log('Connection has been established successfully.');
    }
  }
);
