import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { Express } from "express";
import * as bcrypt from "bcrypt";
import env from "../../../src/main/config/env";
import { setupServer } from "../../../src/main/config/server";

describe("Login Query", () => {
  let app: Express;
  let accounts: Collection;

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
      const fakeAccount = {
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
      };

      await accounts.insertOne({
        ...fakeAccount,
        password: await bcrypt.hash(fakeAccount.password, 12),
      });

      const query = {
        query: `#graphql
          query ($email: String!, $password: String!) {
            login (email: $email, password: $password) {
              accessToken
              name
            }
          }
        `,
        variables: {
          email: fakeAccount.email,
          password: fakeAccount.password,
        },
      };

      const result: any = await request(app).post("/graphql").send(query);
      expect(result.body?.data?.login?.accessToken).toBeTruthy();
      expect(result.body?.data?.login?.name).toBe(fakeAccount.name);
    });
  });
});
