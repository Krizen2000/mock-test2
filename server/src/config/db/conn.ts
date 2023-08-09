import { Db, MongoClient } from "mongodb";

const connectionString = globalThis.mongodbUrl || "";
const client = new MongoClient(connectionString);
let dbConnection: Db;

async function connectToDb(): Promise<void | never> {
  const db = await client.connect();
  dbConnection = db.db("mock-test");
}

const getDbInstance = () => dbConnection;

export { connectToDb, getDbInstance };
