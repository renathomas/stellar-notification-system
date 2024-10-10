import { streamStellarTransactions } from '../services/stellarTransactionService';
import { notifyUser } from '../services/notificationService';
import { findUserByPublicKey } from '../services/userService';
import { logWithThrottleAndBatch } from '../utils/logger';

// Mock dependencies
jest.mock('../services/notificationService');
jest.mock('../services/userService');
jest.mock('../utils/logger');

// Mock the Horizon.Server class from @stellar/stellar-sdk
jest.mock('@stellar/stellar-sdk', () => {
  return {
    Horizon: {
      Server: jest.fn().mockImplementation(() => ({
        transactions: jest.fn().mockReturnThis(),
        cursor: jest.fn().mockReturnThis(),
        stream: jest.fn().mockImplementation(({ onmessage, onerror }) => {
          // Simulate receiving a new transaction with operations
          setTimeout(() => {
            onmessage({
              id: 'transactionId',
              operations: async () => ({
                records: [
                  {
                    type: 'payment',
                    source_account: 'GARQ2YLAVSNQXZOWXHGSSYXYB6BHL3Z2FNZBWCNOZKTQENEEY6CXTSZE',
                    to: 'GDRXE2BQUC3AZD3I3YQF6OUQ5F7DLT5H7V7Q4J7N5ZP3YJ3Q5UX5TQXG',
                  },
                ],
              }),
            });
          }, 0);

          // Simulate an error for the error test
          setTimeout(() => {
            onerror(new Error('Streaming error'));
          }, 0);

          return {
            cancel: jest.fn(),
          };
        }),
      })),
    },
  };
});

const mockTransaction = {
  id: 'transactionId',
  operations: async () => ({
    records: [
      {
        type: 'payment',
        source_account: 'GARQ2YLAVSNQXZOWXHGSSYXYB6BHL3Z2FNZBWCNOZKTQENEEY6CXTSZE',
        to: 'GDRXE2BQUC3AZD3I3YQF6OUQ5F7DLT5H7V7Q4J7N5ZP3YJ3Q5UX5TQXG',
      },
    ],
  }),
};

describe('streamStellarTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should notify user when a new transaction is received', async () => {
    // Mock user service to return a user
    (findUserByPublicKey as jest.Mock).mockResolvedValueOnce({
      id: 'f658804c9fdb5',
      username: 'scottymrty',
    });

    // Call the function
    streamStellarTransactions();

    // Wait for the asynchronous operations to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Check if notifyUser was called for the involved account
    expect(notifyUser).toHaveBeenCalledWith('f658804c9fdb5', expect.objectContaining({ id: 'transactionId' }));
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith(`New transaction received: ${mockTransaction.id}`);
  });

  it('should log an error on streaming error', async () => {
    // Call the function
    streamStellarTransactions();

    // Wait for the asynchronous operations to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Expect logWithThrottleAndBatch to have been called with the streaming error
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith('Streaming error:', expect.any(Error));
  });
});
