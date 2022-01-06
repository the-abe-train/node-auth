import dotenv from 'dotenv';

dotenv.config();

export const  mongoUrl = process.env.MONGO_URL ?? '';
export const jwtSignature = process.env.JWT_SIGNATURE ?? '';