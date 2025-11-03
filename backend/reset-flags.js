#!/usr/bin/env node

/*
 * FLAG RESET UTILITY
 * 
 * This script is for LOCAL USE ONLY to regenerate flags.
 * 
 * Usage: node reset-flags.js
 * 
 * After running this script, restart the backend server to apply new flags.
 */

const crypto = require('crypto');

console.log('\n=================================');
console.log('🔄 FLAG REGENERATION UTILITY');
console.log('=================================\n');

console.log('⚠️  WARNING: This will generate new flags.');
console.log('You must RESTART the backend server after running this script.\n');

function generateFlag() {
  return 'FLAG-' + crypto.randomBytes(8).toString('hex');
}

const newFlags = {
  easy: generateFlag(),
  medium: generateFlag(),
  hard: generateFlag()
};

console.log('New flags generated:');
console.log('Easy:  ', newFlags.easy);
console.log('Medium:', newFlags.medium);
console.log('Hard:  ', newFlags.hard);

console.log('\n📝 NOTE: These flags are display-only.');
console.log('The actual flags are generated when the server starts.');
console.log('To apply new flags, restart the backend server with:');
console.log('  npm start\n');

console.log('=================================\n');
