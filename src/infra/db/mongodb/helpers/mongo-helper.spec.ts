import { MongoHelper as sut } from "./mongo-helper";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it("should reconnect if mongodb is down", async () => {
    let accounts = await sut.getCollection("accounts");
    expect(accounts).toBeTruthy();
    await sut.disconnect();
    accounts = await sut.getCollection("accounts");
    expect(accounts).toBeTruthy();
  });
});
