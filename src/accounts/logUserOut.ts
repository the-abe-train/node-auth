import { session } from "../session/session.js";
import jwt from 'jsonwebtoken';
import { jwtSignature } from "../env.js";
import { FastifyReply, FastifyRequest } from "fastify";

// interface JwtPayload {
//   sessionToken: string
// }

export async function logUserOut(request: FastifyRequest, reply: FastifyReply) {

  try {
    
    // get refresh token
    // decode session token from refresh token
    if (request?.cookies?.refreshToken) {
      // If there is no access token, decode the refresh token,
      const { refreshToken } = request.cookies;
      const decodedToken = jwt.verify(refreshToken, jwtSignature);

      if (typeof decodedToken === "string") {
        throw "decoded access token wrong type";
      }

      const { sessionToken } = decodedToken;

      // delete database record for session
      await session.deleteOne({sessionToken});
    }


    // remove cookies
    reply.clearCookie('refreshToken').clearCookie('accessToken');

  } catch (e) {
    console.error(e);
  }
} 