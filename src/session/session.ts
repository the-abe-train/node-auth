import { client } from "../db";

export const session = client.db('test').collection('session')
// .createIndex({ sessionToken: 1 });

// session.createIndex({ sessionToken: 1 })