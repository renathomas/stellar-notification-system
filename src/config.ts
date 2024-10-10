import dotenv from 'dotenv';

dotenv.config();

export const config = {
  stellarApiUrl: process.env.STELLAR_API_URL || 'https://horizon.stellar.org',
  decafApiUrl: process.env.DECAF_API_URL || 'https://staging.decafapi.com',
  notificationsApiKey: process.env.NOTIFICATIONS_API_KEY || 'default-api-key',
  maxRetries: process.env.MAX_RETRIES || 3
};
