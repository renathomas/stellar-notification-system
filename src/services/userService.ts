import axios from 'axios';
import { logWithThrottleAndBatch } from '../utils/logger';
import { config } from '../config';
import { User } from '../interfaces/user';

export async function findUserByPublicKey(publicKey: string): Promise<User | null> {
  logWithThrottleAndBatch(`Searching for user with publicKey: ${publicKey}`);
  try {
    const response = await axios.get(`${config.decafApiUrl}/searchUserProfile?text=${publicKey}`);
    const user: User = response.data;

    return user || null;
  } catch (error) {
    logWithThrottleAndBatch('Error finding user by publicKey:', error);
    return null;
  }
}
