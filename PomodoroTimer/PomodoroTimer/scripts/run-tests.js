#!/usr/bin/env node

/**
 * Test execution script for Pomodoro Timer
 * Provides convenient commands to run different types of tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n${description}`, 'cyan');
  log(`Running: ${command}`, 'yellow');
  
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    return false;
  }
}

function checkDependencies() {
  log('Checking dependencies...', 'blue');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found. Please run this script from the project root.', 'red');
    process.exit(1);
  }
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('📦 Installing dependencies...', 'yellow');
    execCommand('npm install', 'Dependency installation');
  }
  
  log('✅ Dependencies check completed', 'green');
}

function runUnitTests() {
  log('\n🧪 Running Unit Tests', 'bright');
  return execCommand('npm run test:unit', 'Unit tests');
}

function runIntegrationTests() {
  log('\n🔗 Running Integration Tests', 'bright');
  return execCommand('npm run test:integration', 'Integration tests');
}

function runE2ETests() {
  log('\n🌐 Running E2E Tests', 'bright');
  
  // Check if Playwright browsers are installed
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
  } catch (error) {
    log('📥 Installing Playwright browsers...', 'yellow');
    execCommand('npx playwright install', 'Playwright browser installation');
  }
  
  return execCommand('npm run test:e2e', 'E2E tests');
}

function runCoverageTests() {
  log('\n📊 Running Coverage Tests', 'bright');
  const success = execCommand('npm run test:coverage', 'Coverage tests');
  
  if (success) {
    const coverageReportPath = path.join(process.cwd(), 'coverage', 'lcov-report', 'index.html');
    if (fs.existsSync(coverageReportPath)) {
      log(`📈 Coverage report generated: ${coverageReportPath}`, 'green');
    }
  }
  
  return success;
}

function runAllTests() {
  log('\n🚀 Running All Tests', 'bright');
  
  const results = {
    unit: runUnitTests(),
    integration: runIntegrationTests(),
    e2e: runE2ETests(),
    coverage: runCoverageTests()
  };
  
  // Summary
  log('\n📋 Test Results Summary', 'bright');
  log('========================', 'bright');
  
  Object.entries(results).forEach(([testType, success]) => {
    const status = success ? '✅ PASSED' : '❌ FAILED';
    const color = success ? 'green' : 'red';
    log(`${testType.toUpperCase().padEnd(12)} ${status}`, color);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    log('\n🎉 All tests passed successfully!', 'green');
    return true;
  } else {
    log('\n💥 Some tests failed. Please check the output above.', 'red');
    return false;
  }
}

function startDevServer() {
  log('\n🌐 Starting Development Server', 'bright');
  log('Server will be available at http://localhost:3000', 'cyan');
  log('Press Ctrl+C to stop the server', 'yellow');
  
  execCommand('npm run serve', 'Development server');
}

function showHelp() {
  log('\n🔧 Pomodoro Timer Test Runner', 'bright');
  log('==============================', 'bright');
  log('\nAvailable commands:', 'cyan');
  log('  unit        Run unit tests only', 'white');
  log('  integration Run integration tests only', 'white');
  log('  e2e         Run E2E tests only', 'white');
  log('  coverage    Run tests with coverage report', 'white');
  log('  all         Run all tests (default)', 'white');
  log('  serve       Start development server', 'white');
  log('  help        Show this help message', 'white');
  
  log('\nExamples:', 'cyan');
  log('  node scripts/run-tests.js unit', 'yellow');
  log('  node scripts/run-tests.js all', 'yellow');
  log('  npm run test:unit', 'yellow');
}

function main() {
  const command = process.argv[2] || 'all';
  
  log('🍅 Pomodoro Timer Test Suite', 'magenta');
  log('============================', 'magenta');
  
  // Check dependencies first
  checkDependencies();
  
  let success = true;
  
  switch (command.toLowerCase()) {
    case 'unit':
      success = runUnitTests();
      break;
      
    case 'integration':
      success = runIntegrationTests();
      break;
      
    case 'e2e':
      success = runE2ETests();
      break;
      
    case 'coverage':
      success = runCoverageTests();
      break;
      
    case 'all':
      success = runAllTests();
      break;
      
    case 'serve':
      startDevServer();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      log(`❌ Unknown command: ${command}`, 'red');
      showHelp();
      process.exit(1);
  }
  
  if (command !== 'serve' && command !== 'help') {
    process.exit(success ? 0 : 1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`💥 Uncaught Exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

// Run the main function
main();
