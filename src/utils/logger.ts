import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
  ],
});

const THROTTLE_INTERVAL_MS = 500;
const BATCH_INTERVAL_MS = 5000;
const MAX_BATCH_SIZE = 10;

let lastLogTime = 0;
let logBatch: string[] = [];

// Function to log messages with throttling and batching
function logWithThrottleAndBatch(...messages: any[]) {
  const currentTime = Date.now();

  if (currentTime - lastLogTime >= THROTTLE_INTERVAL_MS) {
    lastLogTime = currentTime;

    logBatch.push(messages.map(msg => (typeof msg === 'object' ? JSON.stringify(msg) : msg)).join(' '));

    if (logBatch.length >= MAX_BATCH_SIZE) {
      flushLogBatch();
    }
  }
}

function flushLogBatch() {
  if (logBatch.length > 0) {
    logger.info('Batch log:', { messages: logBatch });
    logBatch = [];
  }
}

setInterval(flushLogBatch, BATCH_INTERVAL_MS);

export { logger, logWithThrottleAndBatch };
