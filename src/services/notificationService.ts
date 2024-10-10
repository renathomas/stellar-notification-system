import axios from 'axios';
import { logWithThrottleAndBatch } from '../utils/logger';
import { config } from '../config';
import { Transaction } from '../interfaces/transaction';

export async function notifyUser(userId: string, transaction: Transaction) {
  const compositeKey = `${transaction.id}-${userId}`;
  const isProcessed = await checkIfProcessed(compositeKey);
  if (isProcessed) {
    logWithThrottleAndBatch(`Transaction ${transaction.id} for user ${userId} already processed. Skipping notification.`);
    return;
  }

  for (let attempt = 1; attempt <= Number(config.maxRetries); attempt++) {
    try {
      const notification = {
        title: 'Stellar Transaction',
        body: `You have a new transaction: ${transaction.id}`,
        data: transaction
      };

      await axios.post(`${config.decafApiUrl}/notifications/send`, {
        userIds: [userId],
        notification
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': config.notificationsApiKey
        }
      });

      // Mark as processed after successful notification
      await markAsProcessed(compositeKey);

      logWithThrottleAndBatch(`Notification sent to user ${userId} for transaction ${transaction.id}`);
      return; // Exit the function on success
    } catch (error) {
      logWithThrottleAndBatch(`Error sending notification to user ${userId} for transaction ${transaction.id} (attempt ${attempt}):`, error);
      if (attempt === config.maxRetries) {
        throw new Error(`Failed to send notification after ${config.maxRetries} attempts`);
      }
      // Optionally, you can add a delay before retrying
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
  }
}

async function checkIfProcessed(compositeKey: string): Promise<boolean> {
  // Implement logic to check if the compositeKey exists in the processed_transactions table
  // Return true if it exists, false otherwise
  return false;
}

async function markAsProcessed(compositeKey: string): Promise<void> {
  // Implement logic to insert the compositeKey into the processed_transactions table
}
