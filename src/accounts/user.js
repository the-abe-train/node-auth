import mongo from 'mongodb'
import jwt from "jsonwebtoken";
import { user } from "../user/user.js";
import { session } from '../session/session.js';
import { createTokens } from './tokens.js';

const { ObjectId } = mongo;

const jwtSignature = process.env.JWT_SIGNATURE;

export async function getUserFromCookies(request, reply) {
  try {

    // check that access token exists
    if (request?.cookies?.accessToken) {

      // Get the access and refresh tokens
      const { accessToken } = request.cookies;

      // If there is an acess token, decode the access token
      const decodedAccessToken = jwt.verify(accessToken, jwtSignature);
      console.log(decodedAccessToken);

      // Return user form record
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId)
      });
    }
    if (request?.cookies?.refreshToken) {
      // If there is no access token, decode the refresh token,
      const { refreshToken } = request.cookies;
      const { sessionToken } = jwt.verify(refreshToken, jwtSignature);


      // lookup session
      const currentSession = await session.findOne({ sessionToken })

      // If session is valid, look up current user, 
      if (currentSession.valid) {
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId)
        })
        console.log('current user', currentUser);

        // refresh tokens, return current user
        await refreshTokens(sessionToken, currentUser._id, reply)
        return currentUser
      }

    }

  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokens(sessionToken, userId, reply) {
  try {

    // Create JWT
    const { accessToken, refreshToken } = await createTokens(
      sessionToken, userId
    )

    // Set cookie
    const now = new Date();
    const refreshExpires = now.setDate(now.getDate() + 30);

    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        domain: 'localhost',
        httpOnly: true,
        expires: refreshExpires
        // secure
      })
      .setCookie('accessToken', accessToken, {
        path: '/',
        domain: 'localhost',
        httpOnly: true,
        // expires
        // secure
      })
  } catch (e) {
    console.error(e);
  }
}