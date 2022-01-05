import { randomBytes } from 'crypto';
import { session } from '../session/session.js';

export async function createSession(userId, connection) {

  try {

    // generate a session token
    const sessionToken = randomBytes(43).toString('hex');

    // retrieve connection information
    const { ip, userAgent } = connection;

    // database insert for session
    // const {session} = await session();
    await session.insertOne({
      sessionToken,
      userId, valid: true, userAgent, ip,
      updatedAt: new Date(),
      createdAt: new Date()
    })


    return sessionToken
  } catch (error) {
    throw new Error('session creation failed')
  }

}