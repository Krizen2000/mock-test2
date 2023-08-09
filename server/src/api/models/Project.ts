import { getDbInstance } from "@config/db/conn";
import DbCollection from "@helpers/DatabaseHelper";
import { Collection, ObjectId, WithoutId } from "mongodb";

type Project = {
  _id: ObjectId;
  client: ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  deployUrl: string;
  email: string;
  password: string;
};

class ProjectSchema implements DbCollection {
  private collection: Collection<Project>;

  constructor() {
    const dbInstance = getDbInstance();
    this.collection = dbInstance.collection<Project>("project");
  }

  async exists(item: Partial<Project>) {
    let Project: Project | null;
    try {
      Project = await this.collection.findOne(item);
    } catch (err) {
      console.log(err);
      return false;
    }
    return Project ? true : false;
  }

  async findOne(item: Partial<Project>) {
    let result: Project | null;
    try {
      result = await this.collection.findOne(item);
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!result) return null;
    return result;
  }

  async find(item?: Partial<Project>) {
    let result: Project[] | null;
    try {
      if (!item) result = await this.collection.find().toArray();
      else result = await this.collection.find(item).toArray();
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!result) return null;
    return result;
  }

  async createOne(data: WithoutId<Project>) {
    let _id: ObjectId | null;
    try {
      _id = (await this.collection.insertOne(data as Project)).insertedId;
    } catch (err) {
      console.log(err);
      return null;
    }
    if (!_id) return null;
    return { _id, ...data };
  }

  async findOneAndUpdate(item: Partial<Project>, data: Partial<Project>) {
    let updated: boolean;
    console.log("filter:", item);
    try {
      updated = (await this.collection.findOneAndUpdate(item, { $set: data }))
        .ok
        ? true
        : false;
    } catch (err) {
      console.log(err);
      return false;
    }
    if (!updated) return false;
    return updated;
  }

  async findOneAndDelete(item: Partial<Project>) {
    let deleted: boolean;
    try {
      deleted = (await this.collection.deleteOne(item)).acknowledged;
    } catch (err) {
      console.log(err);
      return false;
    }
    if (!deleted) return false;
    return deleted;
  }
}

export default ProjectSchema;
