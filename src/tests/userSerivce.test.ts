import nock from 'nock';
import { findUserByPublicKey } from '../services/userService';
import { config } from '../config';
import { logWithThrottleAndBatch } from '../utils/logger';
import { User } from '../interfaces/user';

// Mock logger to suppress output during tests
jest.mock('../utils/logger');

describe('userService', () => {
  const publicKey = 'GARQ2YLAVSNQXZOWXHGSSYXYB6BHL3Z2FNZBWCNOZKTQENEEY6CXTSZE';
  const mockUser: User = {
    id: 'f658804c9fdb5',
    username: 'scottymrty',
    accountInfos: [
      {
        publicKey: publicKey,
        chain: 'stellar',
      },
    ],
  };

  beforeEach(() => {
    nock.cleanAll();
  });

  it('should return a user when the public key is found', async () => {
    const scope = nock(config.decafApiUrl)
      .get(`/searchUserProfile?text=${publicKey}`)
      .reply(200, mockUser);

    const user = await findUserByPublicKey(publicKey);

    expect(scope.isDone()).toBe(true); // Verify that the request was made
    expect(user).toEqual(mockUser);
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith(`Searching for user with publicKey: ${publicKey}`);
  });

  it('should return null when the public key is not found', async () => {
    const scope = nock(config.decafApiUrl)
      .get(`/searchUserProfile?text=${publicKey}`)
      .reply(404, {});

    const user = await findUserByPublicKey(publicKey);

    expect(scope.isDone()).toBe(true); // Verify that the request was made
    expect(user).toBeNull();
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith(`Searching for user with publicKey: ${publicKey}`);
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith('Error finding user by publicKey:', expect.anything());
  });

  it('should return null and log an error when the request fails', async () => {
    const scope = nock(config.decafApiUrl)
      .get(`/searchUserProfile?text=${publicKey}`)
      .replyWithError('Network error');

    const user = await findUserByPublicKey(publicKey);

    expect(scope.isDone()).toBe(true); // Verify that the request was made
    expect(user).toBeNull();
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith(`Searching for user with publicKey: ${publicKey}`);
    expect(logWithThrottleAndBatch).toHaveBeenCalledWith('Error finding user by publicKey:', expect.anything());
  });
});
