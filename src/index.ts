import './mocks';

import { streamStellarTransactions } from './services/stellarTransactionService';
import { logWithThrottleAndBatch } from './utils/logger';
import { config } from './config';

// Function to initialize the application
function initializeApp() {
  // Start Stellar transaction streaming
  streamStellarTransactions();

  logWithThrottleAndBatch('Application initialized successfully.');
}

// Function to handle graceful shutdown
function setupGracefulShutdown() {
  const shutdown = () => {
    logWithThrottleAndBatch('Shutting down application...');
    process.exit();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Main execution
try {
  initializeApp();
  setupGracefulShutdown();
} catch (error) {
  logWithThrottleAndBatch('Error during application initialization:', error);
  process.exit(1);
}
