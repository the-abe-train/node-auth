import { randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import { session } from '../session/session';

interface Connection {
  ip: string,
  userAgent: string
}

export async function createSession(userId: ObjectId, connection: Connection) {

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