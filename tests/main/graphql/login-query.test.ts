import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { Express } from "express";
import * as bcrypt from "bcrypt";
import env from "../../../src/main/config/env";
import { setupServer } from "../../../src/main/config/server";
import { AddAccountRequestModel } from "../../../src/domain/usecases";

describe("Login Query", () => {
  let app: Express;
  let accounts: Collection;

  const makeLoginQuery = (email: string, password: string) => ({
    query: `#graphql
            query ($email: String!, $password: String!) {
              login (email: $email, password: $password) {
                accessToken
                name
              }
            }
          `,
    variables: { email, password },
  });

  const makeAccount = async (
    account: AddAccountRequestModel
  ): Promise<void> => {
    await accounts.insertOne({
      ...account,
      password: await bcrypt.hash(account.password, 12),
    });
  };

  beforeEach(async () => {
    accounts = await MongoHelper.getCollection("accounts");
    await accounts.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
    ({ app } = await setupServer());
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe("login() query", () => {
    it("should return access token and name for valid credentials", async () => {
      const fakeData = {
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
      };

      await makeAccount(fakeData);
      const query = makeLoginQuery(fakeData.email, fakeData.password);

      const result = await request(app).post("/graphql").send(query);

      expect(result.body?.data?.login?.accessToken).toBeTruthy();
      expect(result.body?.data?.login?.name).toBe(fakeData.name);
    });

    it("should return UNAUTHORIZED for invalid credentials", async () => {
      const query = makeLoginQuery(
        "invalid_email@email.com",
        "invalid_password"
      );

      const result = await request(app).post("/graphql").send(query);

      expect(result.body?.data).toBeFalsy();
      expect(result.body?.errors[0].extensions.code).toBe("UNAUTHORIZED");
    });
  });
});
