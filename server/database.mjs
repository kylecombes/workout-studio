import MongoClient from 'mongodb';


function getDatabaseConnection() {
  return new Promise((resolve, reject) => {
    // Connect to the MongoDB database
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const mongoPort = process.env.MONGO_PORT;
    const cluster1 = process.env.MONGO_CLUSTER1;
    const cluster2 = process.env.MONGO_CLUSTER2;
    const cluster3 = process.env.MONGO_CLUSTER3;
    const dbName = process.env.MONGO_DB_NAME;
    const replicaSet = process.env.MONGO_REPLICA_SET;
    const authSource = process.env.MONGO_AUTH_SOURCE || 'admin';

    if (!(username && password && cluster1 && cluster2 && cluster3 && dbName && replicaSet)) {
      // Couldn't find environment variables
      console.error('Please check your environment variables to make sure the following are defined:');
      console.error('\t- MONGO_USERNAME');
      console.error('\t- MONGO_PASSWORD');
      console.error('\t- MONGO_PORT');
      console.error('\t- MONGO_CLUSTER1');
      console.error('\t- MONGO_CLUSTER2');
      console.error('\t- MONGO_CLUSTER3');
      console.error('\t- MONGO_DB_NAME');
      console.error('\t- MONGO_REPLICA_SET');
      console.warn('Connection to MongoDB failed, so not starting WebSocket server. HTTP server still running.');
      reject(new Error('Could not find required environment variables'));
    } else {

      const mongoUri = `mongodb://${username}:${password}@${cluster1}:${mongoPort},${cluster2}:${mongoPort},${cluster3}:${mongoPort}/${dbName}?ssl=true&replicaSet=${replicaSet}&authSource=${authSource}`;
      // Connect to the database
      MongoClient.connect(mongoUri, (err, client) => {
        if (!err) {
          console.log('Successfully connected to MongoDB instance.');
          let db = client.db(dbName);
          if (db) {
            resolve(db);
          } else {
            reject(`Could not find database named "${dbName}"`);
          }
        } else {
          console.error(err);
          console.error('Error connecting to MongoDB instance.');
          reject(err);
        }
      });
    }
  });
}

export default getDatabaseConnection;