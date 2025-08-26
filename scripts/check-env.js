#!/usr/bin/env node
// Script to check the environment and dependencies for HealthTrackPlus

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const requiredTools = [
  { name: 'Node.js', command: 'node --version', minVersion: '18.0.0' },
  { name: 'npm', command: 'npm --version', minVersion: '8.0.0' },
];

const optionalTools = [
  { name: 'PostgreSQL', command: 'psql --version', notes: 'Required for database' },
  { name: 'Android Studio', check: checkAndroidStudio, notes: 'Required for Android development' },
  { name: 'Xcode', check: checkXcode, notes: 'Required for iOS development (macOS only)' },
];

const requiredFiles = [
  { path: '.env', notes: 'Environment configuration', template: '.env.example' },
];

function checkVersion(version, minVersion) {
  const vParts = version.trim().replace(/^v/, '').split('.').map(Number);
  const minParts = minVersion.split('.').map(Number);
  
  for (let i = 0; i < Math.max(vParts.length, minParts.length); i++) {
    const v = vParts[i] || 0;
    const min = minParts[i] || 0;
    if (v > min) return true;
    if (v < min) return false;
  }
  
  return true; // Equal versions
}

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    return null;
  }
}

function checkAndroidStudio() {
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';
  
  if (isWindows) {
    // Check Windows path
    const programFiles = process.env['ProgramFiles'];
    const programFilesX86 = process.env['ProgramFiles(x86)'];
    return fs.existsSync(path.join(programFiles, 'Android', 'Android Studio')) || 
           fs.existsSync(path.join(programFilesX86, 'Android', 'Android Studio'));
  } else if (isMac) {
    // Check macOS path
    return fs.existsSync('/Applications/Android Studio.app');
  } else if (isLinux) {
    // Check common Linux paths
    return fs.existsSync('/opt/android-studio') || 
           fs.existsSync('/usr/local/android-studio') || 
           fs.existsSync(path.join(process.env.HOME, 'android-studio'));
  }
  
  return false;
}

function checkXcode() {
  if (process.platform !== 'darwin') return 'Not applicable';
  
  const xcodeSelect = runCommand('xcode-select -p');
  return !!xcodeSelect;
}

// Header
console.log('\n=== HealthTrackPlus Environment Check ===\n');

// Check required tools
console.log('Required tools:');
let allRequirementsMet = true;

for (const tool of requiredTools) {
  process.stdout.write(`- ${tool.name}: `);
  
  const version = runCommand(tool.command);
  
  if (!version) {
    console.log('\x1b[31mNot found\x1b[0m');
    allRequirementsMet = false;
    continue;
  }
  
  if (tool.minVersion) {
    const isVersionOk = checkVersion(version, tool.minVersion);
    if (isVersionOk) {
      console.log(`\x1b[32m${version.trim()}\x1b[0m`);
    } else {
      console.log(`\x1b[31m${version.trim()} (min: ${tool.minVersion})\x1b[0m`);
      allRequirementsMet = false;
    }
  } else {
    console.log(`\x1b[32m${version.trim()}\x1b[0m`);
  }
}

console.log('\nOptional tools:');
for (const tool of optionalTools) {
  process.stdout.write(`- ${tool.name}: `);
  
  let isInstalled;
  
  if (tool.check) {
    isInstalled = tool.check();
  } else {
    isInstalled = !!runCommand(tool.command);
  }
  
  if (isInstalled) {
    console.log('\x1b[32mInstalled\x1b[0m');
  } else {
    console.log(`\x1b[33mNot found\x1b[0m ${tool.notes ? `(${tool.notes})` : ''}`);
  }
}

console.log('\nRequired files:');
for (const file of requiredFiles) {
  process.stdout.write(`- ${file.path}: `);
  
  const exists = fs.existsSync(path.join(process.cwd(), file.path));
  
  if (exists) {
    console.log('\x1b[32mFound\x1b[0m');
  } else {
    console.log(`\x1b[31mMissing\x1b[0m ${file.template ? `(Use ${file.template} as template)` : ''}`);
    allRequirementsMet = false;
  }
}

console.log('\n=== Summary ===');
if (allRequirementsMet) {
  console.log('\x1b[32mAll required components are installed and configured.\x1b[0m');
  console.log('You can run the application with: npm run dev:local');
} else {
  console.log('\x1b[31mSome requirements are missing. Please address the issues above.\x1b[0m');
  console.log('Run the setup script to configure your environment: scripts/setup.sh');
}
console.log('');