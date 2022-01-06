import mongo, { MongoClientOptions } from "mongodb";
const { MongoClient } = mongo;
import { mongoUrl } from "./env.js";

interface Options extends MongoClientOptions {
  useNewUrlParser: boolean;
}

const options: Options = { useNewUrlParser: true };

export const client = new MongoClient(mongoUrl, options);

export async function connectDb() {
  try {
    await client.connect();

    // Confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to DB success 🗃");
  } catch (e) {
    console.error(e);
    // If there is a problem close connection to db
    await client.close();
  }
}
