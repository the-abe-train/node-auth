import { client } from "../db.js";

export const user = client.db('test').collection('user')
// .createIndex({ 'email.address': 1 });