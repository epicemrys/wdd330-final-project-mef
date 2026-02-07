#!/usr/bin/env node
// build-config.js - Generates config.js from environment variables

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'js', 'config.js');

// Read environment variables
const ticketmasterKey = process.env.TICKETMASTER_KEY || '';
const googleMapsKey = process.env.GOOGLE_MAPS_KEY || '';

// Generate config.js content
const configContent = `// config.js - Generated from environment variables at build time

export const API_KEYS = {
    TICKETMASTER_KEY: '${ticketmasterKey}',
    GOOGLE_MAPS_KEY: '${googleMapsKey}'
};

export const BASE_URL = window.location.origin;
`;

// Write config.js
fs.writeFileSync(configPath, configContent, 'utf8');
console.log('✅ config.js generated successfully from environment variables');
