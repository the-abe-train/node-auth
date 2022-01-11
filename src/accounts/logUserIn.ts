import { createSession } from "./session";
import { refreshTokens } from "./user";
import { ObjectId } from "mongodb";
import { FastifyReply, FastifyRequest } from "fastify";

export async function logUserIn(
  userId: ObjectId,
  request: FastifyRequest,
  reply: FastifyReply
) {

  const header = request.headers["user-agent"];

  if (!header) {
    throw "No header"
  }

  const connectionInformation = {
    ip: request.ip,
    userAgent: header,
  };

  // Create Session
  const sessionToken = await createSession(userId, connectionInformation);
  // console.log('sessionToken', sessionToken);

  // Create JWT
  // const { accessToken, refreshToken } = await createTokens(sessionToken, userId);
  await refreshTokens(sessionToken, userId, reply);
}
