// Jest setup file for ES6 modules support

// Set longer timeout for tests that need database operations
if (typeof jest !== 'undefined') {
  jest.setTimeout(30000);
}

// Suppress experimental warnings
process.env.NODE_NO_WARNINGS = '1';

// Handle graceful shutdown
if (typeof afterAll !== 'undefined') {
  afterAll(async () => {
    // Give time for async cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
  });
}