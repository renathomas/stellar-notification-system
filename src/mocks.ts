import nock from 'nock';
import { config } from './config';

// Mock Users API
nock(config.decafApiUrl)
  .persist()
  .get('/searchUserProfile')
  .query(true)
  .reply(200, {
    id: 'f658804c9fdb5',
    username: 'scottymrty',
    email: "scott@decaf.so",
    photoUrl: "",
    accountInfos: [
      { publicKey: 'GARQ2YLAVSNQXZOWXHGSSYXYB6BHL3Z2FNZBWCNOZKTQENEEY6CXTSZE', chain: 'stellar' },
    ]
  });

// Mock Notifications API
nock(config.decafApiUrl)
  .persist()
  .post('/notifications/send')
  .reply(200, { message: 'Notification sent successfully' })
  .post('/notifications/send')
  .reply(500, { message: 'Internal Server Error' });
