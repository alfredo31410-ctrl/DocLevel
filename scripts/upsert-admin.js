const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

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
const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD;

if (!uri) {
  console.error('Missing MONGO_URL or MONGODB_URI.');
  process.exit(1);
}

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.');
  process.exit(1);
}

if (password.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  const admins = db.collection('admins');
  const hash = await bcrypt.hash(password, 12);

  const result = await admins.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        password: hash,
        updated_at: new Date(),
      },
      $setOnInsert: {
        id: randomUUID(),
        created_at: new Date(),
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  await client.close();
  console.log(`Admin ready: ${result.email || email}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
