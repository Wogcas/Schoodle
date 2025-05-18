const { initializeScheduler } = require('./scheduler/submissionScheduler');
const logger = require('./config/logger');

async function main() {
  try {
    await initializeScheduler();
    logger.info('Service started successfully');
  } catch (error) {
    logger.error('Failed to start service', error);
    process.exit(1);
  }
}

main();