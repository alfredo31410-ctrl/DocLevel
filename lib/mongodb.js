import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL || process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'DocLevel';

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  if (!uri) {
    throw new Error('Missing MONGO_URL or MONGODB_URI environment variable');
  }

  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}
