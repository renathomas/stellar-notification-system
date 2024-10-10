import axios from 'axios';
import { notifyUser } from '../services/notificationService';
import { logWithThrottleAndBatch } from '../utils/logger';
import { Transaction } from '../interfaces/transaction';
import { config } from '../config';

// Mock axios and logger
jest.mock('axios');
jest.mock('../utils/logger');

describe('notificationService', () => {
  const mockUserId = 'f658804c9fdb5';
  const mockTransaction: Transaction = {
    id: '12345',
    hash: 'abcdef1234567890',
    ledger: 12345,
    created_at: '2023-10-01T00:00:00Z',
    source_account: 'GABC12345',
    memo_type: 'text',
    operation_count: 1,
    _links: {
      account: { href: 'https://horizon.stellar.org/accounts/GABC12345' },
      effects: { href: 'https://horizon.stellar.org/effects?transaction=12345', templated: true },
      ledger: { href: 'https://horizon.stellar.org/ledgers/12345' },
      operations: { href: 'https://horizon.stellar.org/operations?transaction=12345', templated: true },
      precedes: { href: 'https://horizon.stellar.org/transactions?cursor=12345&order=asc' },
      self: { href: 'https://horizon.stellar.org/transactions/12345' },
      succeeds: { href: 'https://horizon.stellar.org/transactions?cursor=12345&order=desc' },
      transaction: { href: 'https://horizon.stellar.org/transactions/12345' },
    },
    envelope_xdr: 'AAAA...',
    fee_account: 'GABC12345',
    fee_charged: '100',
    fee_meta_xdr: 'AAAA...',
    max_fee: '200',
    paging_token: '1234567890',
    preconditions: {
      timebounds: {
        max_time: '2023-10-02T00:00:00Z',
        min_time: '2023-10-01T00:00:00Z',
      },
    },
    result_meta_xdr: 'AAAA...',
    result_xdr: 'AAAA...',
    signatures: ['abcdef1234567890'],
    source_account_sequence: '9876543210',
    successful: true,
    valid_after: '2023-10-01T00:00:00Z',
    valid_before: '2023-10-02T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send notification when transaction is not processed', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({});

    await notifyUser(mockUserId, mockTransaction);

    expect(axios.post).toHaveBeenCalledWith(
      `${config.decafApiUrl}/notifications/send`,
      {
        userIds: [mockUserId],
        notification: {
          title: 'Stellar Transaction',
          body: `You have a new transaction: ${mockTransaction.id}`,
          data: mockTransaction,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': config.notificationsApiKey,
        }
      }
    );
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith(`Notification sent to user ${mockUserId} for transaction ${mockTransaction.id}`);
  });

  it('should retry sending notification on failure and throw error after max retries', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(notifyUser(mockUserId, mockTransaction)).rejects.toThrow(`Failed to send notification after ${config.maxRetries} attempts`);

    expect(axios.post).toHaveBeenCalledTimes(Number(config.maxRetries));
    expect(logWithThrottleAndBatch).toHaveBeenCalledTimes(Number(config.maxRetries));
  });
});
