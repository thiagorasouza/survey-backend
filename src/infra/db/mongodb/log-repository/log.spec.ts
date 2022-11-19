import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { LogMongoRespository } from "./log";

describe("Log Mongo Repository", () => {
  let errors: Collection;

  beforeEach(async () => {
    errors = await MongoHelper.getCollection("errors");
    await errors.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("should create an error log on success", async () => {
    const sut = new LogMongoRespository();
    await sut.logError("any_error");
    const count = await errors.countDocuments();
    expect(count).toBe(1);
  });
});
