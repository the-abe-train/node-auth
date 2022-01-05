import { session } from "../session/session.js";
import jwt from 'jsonwebtoken';

const jwtSignature = process.env.JWT_SIGNATURE;

export async function logUserOut(request, reply) {

  try {
    
    // get refresh token
    // decode session token from refresh token
    if (request?.cookies?.refreshToken) {
      // If there is no access token, decode the refresh token,
      const { refreshToken } = request.cookies;
      const { sessionToken } = jwt.verify(refreshToken, jwtSignature);

      // delete database record for session
      await session.deleteOne({sessionToken});
    }


    // remove cookies
    reply.clearCookie('refreshToken').clearCookie('accessToken');

  } catch (e) {
    console.error(e);
  }
} 