import jwt from "jsonwebtoken";

const jwtSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    // Create reresh token

    // Session id
    const refreshToken = jwt.sign({
      sessionToken
    }, jwtSignature)

    // create access token
    // session ID, user ID
    const accessToken = jwt.sign({
      sessionToken, userId
    }, jwtSignature)

    // Return refresh token and access token
    return { accessToken, refreshToken }

  } catch (error) {
    console.error(error);
  }
}