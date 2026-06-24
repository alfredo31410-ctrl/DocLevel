import { MongoClient } from 'mongodb';
import dns from 'dns';

// Some local ISP/router resolvers reject the SRV lookup used by MongoDB Atlas.
// Vercel keeps its platform DNS; local development uses reliable public DNS.
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
}

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
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    try {
      await client.connect();
      cachedClient = client;
    } catch (error) {
      await client.close().catch(() => {});
      cachedClient = null;
      throw error;
    }
  }
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}
