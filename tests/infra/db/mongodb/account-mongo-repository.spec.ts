import { Collection } from "mongodb";
import {
  AccountMongoRepository,
  MongoHelper,
} from "../../../../src/infra/db/mongodb";
import env from "../../../../src/main/config/env";
import { mockAddAccountParams } from "../../../domain/mocks";

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
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  describe("AddAccountRepository", () => {
    it("should return an account on add success", async () => {
      const sut = makeSut();
      const account = await sut.add(mockAddAccountParams());
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });
  });

  describe("LoadAccountByEmailRepository", () => {
    it("should return an account on loadByEmail success", async () => {
      const sut = makeSut();
      await accounts.insertOne(mockAddAccountParams());
      const account = await sut.loadByEmail("any_email@mail.com");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    it("should return null on loadByEmail fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail("any_email@mail.com");
      expect(account).toBeFalsy();
    });
  });

  describe("UpdateAccessTokenRepository", () => {
    it("should update the account accessToken on updateAccessToken success", async () => {
      const sut = makeSut();

      const result = await accounts.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });
      const { insertedId } = result;

      await sut.updateAccessToken(insertedId.toString(), "any_token");
      const account = await accounts.findOne({ _id: insertedId });

      expect(account).toBeTruthy();
    });
  });

  describe("LoadAccountByTokenRepository", () => {
    it("should return the account on loadByToken without role", async () => {
      const sut = makeSut();

      await accounts.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        accessToken: "any_token",
      });

      const account = await sut.loadByToken("any_token");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    it("should return the account on loadByToken with admin role", async () => {
      const sut = makeSut();

      await accounts.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        accessToken: "any_token",
        role: "admin",
      });

      const account = await sut.loadByToken("any_token", "admin");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    it("should return null on loadByToken with invalid role", async () => {
      const sut = makeSut();

      await accounts.insertOne({
        ...mockAddAccountParams(),
        accessToken: "any_token",
      });

      const account = await sut.loadByToken("any_token", "admin");
      expect(account).toBeFalsy();
    });

    it("should return the account on loadByToken if user is admin", async () => {
      const sut = makeSut();

      await accounts.insertOne({
        ...mockAddAccountParams(),
        accessToken: "any_token",
        role: "admin",
      });

      const account = await sut.loadByToken("any_token");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });

    it("should return null if loadByToken fails", async () => {
      const sut = makeSut();
      const account = await sut.loadByToken("any_token");
      expect(account).toBeFalsy();
    });
  });
});
