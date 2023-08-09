interface DbCollection {
  findOne(item: object): Promise<object | null>;
  find(item: object): Promise<object[] | null>;
  createOne(data: object): Promise<object | null>;
  findOneAndUpdate(item: object, data: object): Promise<boolean | null>;
  findOneAndDelete(item: object): Promise<boolean | null>;
}

export default DbCollection;
