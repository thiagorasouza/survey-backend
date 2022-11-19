import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    const client = new MongoClient(uri);
    this.client = await client.connect();
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: (collection: any): any => {
    return {
      id: collection._id.toString(),
      name: collection.name,
      email: collection.email,
      password: collection.password,
    };
  },
};
