/**
 * Seed wargames into MongoDB.
 * Usage: node scripts/seed-wargames.js
 * Requires: MONGO_URI in .env.local (at apps/battle-link-api/.env.local)
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const mongoUriMatch = envContent.match(/^MONGO_URI=["']?([^"'\r\n]+)["']?/m);

if (!mongoUriMatch) {
  console.error('MONGO_URI not found in .env.local');
  process.exit(1);
}

const MONGO_URI = mongoUriMatch[1];
const wargames = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/wargames.json'), 'utf8')
);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('wargames');

    let inserted = 0;
    let updated = 0;

    for (const game of wargames) {
      const result = await collection.updateOne(
        { id: game.id },
        { $set: game },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        console.log(`  Inserted: ${game.name}`);
        inserted++;
      } else {
        console.log(`  Updated:  ${game.name}`);
        updated++;
      }
    }

    console.log(`\nDone — ${inserted} inserted, ${updated} updated.`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
