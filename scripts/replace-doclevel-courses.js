const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { MongoClient } = require('mongodb');
const doclevelCourses = require('../lib/doclevelCourses.json');

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadLocalEnv();

const uri = process.env.MONGO_URL || process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'DocLevel';

if (!uri) {
  console.error('Missing MONGO_URL or MONGODB_URI.');
  process.exit(1);
}

const now = Date.now();
const courses = doclevelCourses.map((course, index) => ({
  ...course,
  id: randomUUID(),
  created_at: new Date(now - index * 1000),
}));

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  await db.collection('courses').deleteMany({});
  await db.collection('courses').insertMany(courses);

  await client.close();
  console.log(`Replaced courses in ${dbName}.courses with ${courses.length} DocLevel courses.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
