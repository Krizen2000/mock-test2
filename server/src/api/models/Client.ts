import { getDbInstance } from "@config/db/conn";
import DbCollection from "@helpers/DatabaseHelper";
import { Collection, ObjectId, WithoutId } from "mongodb";

type Client = {
  _id: string;
  username: string;
  email: string;
  password: string;
};

class ClientSchema implements DbCollection {
  private collection: Collection<Client>;

  constructor() {
    const dbInstance = getDbInstance();
    this.collection = dbInstance.collection<Client>("client");
  }

  async exists(item: Partial<Client>): Promise<boolean> {
    let client: Client | null;
    try {
      client = await this.collection.findOne(item);
    } catch (err) {
      console.log(err);
      return false;
    }
    return client ? true : false;
  }

  async findOne(item: Partial<Client>): Promise<Client | null> {
    let result: Client | null;
    try {
      result = await this.collection.findOne(item);
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!result) return null;
    return result;
  }

  async find(item: Partial<Client>): Promise<Client[] | null> {
    let result: Client[] | null;
    try {
      result = await this.collection.find(item).toArray();
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!result) return null;
    return result;
  }

  async createOne(data: WithoutId<Client>): Promise<Client | null> {
    let _id: string | null;
    try {
      // @ts-expect-error // No need of parameter "_id" during Insert
      _id = (await this.collection.insertOne(data)).insertedId.toString();
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!_id) return null;
    return { _id, ...data };
  }

  async findOneAndUpdate(
    item: Partial<Client> & { id?: string },
    data: Partial<Client>
  ): Promise<boolean | null> {
    if (item.id) item["_id"] = new ObjectId(item.id) as unknown as string;

    let updated: boolean;
    try {
      updated = (await this.collection.findOneAndUpdate(item, data)).ok
        ? true
        : false;
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!updated) return null;
    return updated;
  }

  async findOneAndDelete(item: Partial<Client>): Promise<boolean | null> {
    let deleted: boolean;
    try {
      deleted = (await this.collection.deleteOne(item)).acknowledged;
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!deleted) return null;
    return deleted;
  }
}

export default ClientSchema;
