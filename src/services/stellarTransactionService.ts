import { Horizon } from '@stellar/stellar-sdk';
import { notifyUser } from './notificationService';
import { findUserByPublicKey } from './userService';
import { logWithThrottleAndBatch } from '../utils/logger';
import { config } from '../config';
import { OperationType } from '../interfaces/operation'; // Adjust the import path as needed

const server = new Horizon.Server(config.stellarApiUrl);

export function streamStellarTransactions() {
  server.transactions()
    .cursor('now')
    .stream({
      onmessage: async (transaction: any) => {
        logWithThrottleAndBatch(`New transaction received: ${transaction.id}`);

        try {
          // Fetch the operations within the transaction
          const operationsPage = await transaction.operations();
          const operations: OperationType[] = operationsPage.records;

          const involvedAccounts = new Set<string>();

          // Extract accounts from operations
          for (const operation of operations) {
            // Include the operation's source account
            if (operation.source_account) {
              involvedAccounts.add(operation.source_account);
            }

            switch (operation.type) {
              case 'create_account':
                if (operation.account) {
                  involvedAccounts.add(operation.account);
                }
                break;

              case 'claim_claimable_balance':
                if (operation.claimant) {
                  involvedAccounts.add(operation.claimant);
                }
                break;

              case 'manage_sell_offer':
              case 'manage_buy_offer':
                if (operation.seller) {
                  involvedAccounts.add(operation.seller);
                }
                break;

              case 'payment':
              case 'path_payment_strict_receive':
              case 'path_payment_strict_send':
                if (operation.to) {
                  involvedAccounts.add(operation.to);
                }
                break;

              case 'account_merge':
                if (operation.into) {
                  involvedAccounts.add(operation.into);
                }
                break;

              default:
                break;
            }
          }

          // Notify users for each unique account
          for (const account of involvedAccounts) {
            const user = await findUserByPublicKey(account);
            if (user) {
              await notifyUser(user.id, transaction);
            }
          }
        } catch (error) {
          logWithThrottleAndBatch('Error processing transaction operations:', error);
        }
      },
      onerror: (error) => {
        logWithThrottleAndBatch('Streaming error:', error);
      },
    });
}
