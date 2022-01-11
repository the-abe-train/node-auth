import { client } from "../db";

export const user = client.db('test').collection('user')
// .createIndex({ 'email.address': 1 });