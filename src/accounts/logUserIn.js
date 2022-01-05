import { createSession } from './session.js'
import { refreshTokens } from './user.js';

export async function logUserIn(userId, request, reply) {

  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers['user-agent']
  }

  // Create Session
  const sessionToken = await createSession(userId, connectionInformation);
  // console.log('sessionToken', sessionToken);

  // Create JWT
  // const { accessToken, refreshToken } = await createTokens(sessionToken, userId);
  await refreshTokens(sessionToken, userId, reply)

}