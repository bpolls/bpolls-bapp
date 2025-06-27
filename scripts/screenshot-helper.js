#!/usr/bin/env node

/**
 * Screenshot Helper Script for BPolls
 * 
 * This script helps you navigate to the right pages for taking screenshots.
 * Run: node scripts/screenshot-helper.js
 */

console.log('🎯 BPolls Screenshot Helper');
console.log('==========================\n');

const screenshots = [
  {
    name: 'Home Page',
    file: 'home-page.png',
    url: 'http://localhost:3001',
    description: 'Landing page with navigation and polls list'
  },
  {
    name: 'Wallet Connection',
    file: 'wallet-connect.png', 
    url: 'http://localhost:3001',
    description: 'Click "Connect Wallet" button to show modal'
  },
  {
    name: 'Connected State',
    file: 'wallet-connected.png',
    url: 'http://localhost:3001',
    description: 'After connecting wallet, show address in header'
  },
  {
    name: 'Create Poll Page',
    file: 'create-poll.png',
    url: 'http://localhost:3001',
    description: 'Click "Create Poll" tab, show empty form'
  },
  {
    name: 'Create Poll Filled',
    file: 'create-poll-filled.png',
    url: 'http://localhost:3001',
    description: 'Fill out the poll creation form with sample data'
  },
  {
    name: 'Voting Interface',
    file: 'voting-interface.png',
    url: 'http://localhost:3001',
    description: 'Click "Vote on this Poll" to show voting options'
  },
  {
    name: 'Mobile View',
    file: 'mobile-view.png',
    url: 'http://localhost:3001',
    description: 'Resize browser to 375px width for mobile view'
  }
];

console.log('Screenshots to take:\n');

screenshots.forEach((shot, index) => {
  console.log(`${index + 1}. ${shot.name}`);
  console.log(`   File: ${shot.file}`);
  console.log(`   URL: ${shot.url}`);
  console.log(`   Description: ${shot.description}\n`);
});

console.log('📝 Instructions:');
console.log('1. Open your browser to http://localhost:3001');
console.log('2. Take screenshots as described above');
console.log('3. Save them in the screenshots/ directory');
console.log('4. Use PNG format with descriptive names\n');

console.log('🎨 For best results:');
console.log('- Use 1920x1080 browser window');
console.log('- Hide bookmarks bar and other UI');
console.log('- Wait for page to fully load');
console.log('- Fill forms with realistic sample data');
console.log('- Show the app in action (voting, creating polls)');

if (process.argv.includes('--open')) {
  const { exec } = require('child_process');
  console.log('\n🚀 Opening browser...');
  exec('open http://localhost:3001');
}