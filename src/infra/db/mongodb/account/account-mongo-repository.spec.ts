import { AccountMongoRepository } from "./account-mongo-repository";
import { MongoHelper } from "../helpers/mongo-helper";
import { Collection } from "mongodb";

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe("Account Mongo Repository", () => {
  let accounts: Collection;

  beforeEach(async () => {
    accounts = await MongoHelper.getCollection("accounts");
    await accounts.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  describe("AddAccountRepository", () => {
    it("should return an account on add success", async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: "any_name",
        email: "any_email",
        password: "any_password",
      });
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email");
      expect(account.password).toBe("any_password");
    });
  });

  describe("LoadAccountByEmailRepository", () => {
    it("should return an account on loadByEmail success", async () => {
      const sut = makeSut();
      await accounts.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      });
      const account = await sut.loadByEmail("any_email@email.com");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@email.com");
      expect(account.password).toBe("any_password");
    });

    it("should return null on loadByEmail fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail("any_email@email.com");
      expect(account).toBeFalsy();
    });
  });

  describe("UpdateAccessTokenRepository", () => {
    it("should update the account accessToken on updateAccessToken success", async () => {
      const sut = makeSut();

      const result = await accounts.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      });
      const { insertedId } = result;

      await sut.updateAccessToken(insertedId.toString(), "any_token");
      const account = await accounts.findOne({ _id: insertedId });

      expect(account).toBeTruthy();
    });
  });
});
