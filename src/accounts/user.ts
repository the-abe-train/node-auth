import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { user } from "../user/user";
import { session } from "../session/session";
import { createTokens } from "./tokens";
import { jwtSignature } from "../env";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getUserFromCookies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // check that access token exists
    if (request?.cookies?.accessToken) {
      // Get the access and refresh tokens
      const { accessToken } = request.cookies;

      // If there is an access token, decode the access token
      const decodedAccessToken = jwt.verify(accessToken, jwtSignature);
      console.log(decodedAccessToken);

      if (typeof decodedAccessToken === "string") {
        throw "decoded access token wrong type";
      }

      // Return user form record
      return user.findOne({
        _id: new ObjectId(decodedAccessToken.userId),
      });
    }
    if (request?.cookies?.refreshToken) {
      // If there is no access token, decode the refresh token,
      const { refreshToken } = request.cookies;
      const decodedRefreshToken = jwt.verify(refreshToken, jwtSignature);

      if (typeof decodedRefreshToken === "string") {
        throw "decoded access token wrong type";
      }

      const { sessionToken } = decodedRefreshToken;

      // lookup session
      const currentSession = await session.findOne({ sessionToken });

      // If session is valid, look up current user,
      if (currentSession?.valid) {
        const currentUser = await user.findOne({
          _id: new ObjectId(currentSession.userId),
        });
        if (currentUser) {
          console.log("current user", currentUser);

          // refresh tokens, return current user
          await refreshTokens(sessionToken, currentUser._id, reply);
          return currentUser;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokens(
  sessionToken: string,
  userId: ObjectId,
  reply: FastifyReply
) {
  try {
    // Create JWT
    const tokens = await createTokens(sessionToken, userId);

    if (tokens) {
      const { accessToken, refreshToken } = tokens;

      // Set cookie
      const now = new Date();
      const refreshExpires = new Date(now.setDate(now.getDate() + 30));

      reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          expires: refreshExpires,
          // secure
        })
        .setCookie("accessToken", accessToken, {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          // expires
          // secure
        });
    } else {
      throw "tokens not found";
    }
  } catch (e) {
    console.error(e);
  }
}
