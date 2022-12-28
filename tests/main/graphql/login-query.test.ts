import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { Express } from "express";
import * as bcrypt from "bcrypt";
import env from "../../../src/main/config/env";
import { setupServer } from "../../../src/main/config/server";
import { LoginRequest } from "../../../src/presentation/controllers/login-controller";
import { SignUpRequest } from "../../../src/presentation/controllers/signup-controller";

describe("Login and SignUp APIs", () => {
  let app: Express;
  let accounts: Collection;

  const makeLoginQuery = (loginData: LoginRequest) => ({
    query: `#graphql
            query ($email: String!, $password: String!) {
              login (email: $email, password: $password) {
                accessToken
                name
              }
            }
          `,
    variables: { ...loginData },
  });

  const makeSignupQuery = (signUpData: SignUpRequest) => ({
    query: `#graphql
            mutation ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
              signup (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
                accessToken
                name
              }
            }
          `,
    variables: { ...signUpData },
  });

  const makeAccount = async (account: SignUpRequest): Promise<void> => {
    await accounts.insertOne({
      ...account,
      password: await bcrypt.hash(account.password, 12),
    });
  };

  const mockAccount = (): SignUpRequest => ({
    name: "valid_name",
    email: "valid_email@email.com",
    password: "valid_password",
    passwordConfirmation: "valid_password",
  });

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
      const fakeData = mockAccount();

      await makeAccount(fakeData);
      const query = makeLoginQuery({
        email: fakeData.email,
        password: fakeData.password,
      });

      const result = await request(app).post("/graphql").send(query);

      expect(result.body?.data?.login?.accessToken).toBeTruthy();
      expect(result.body?.data?.login?.name).toBe(fakeData.name);
    });

    it("should return UNAUTHORIZED for invalid credentials", async () => {
      const query = makeLoginQuery({
        email: "invalid_email@email.com",
        password: "invalid_password",
      });

      const result = await request(app).post("/graphql").send(query);

      expect(result.body?.data).toBeFalsy();
      expect(result.body?.errors[0].extensions.code).toBe("UNAUTHORIZED");
    });
  });

  describe("signup() mutation", () => {
    it("should return access token and name for valid data", async () => {
      const fakeData = mockAccount();

      const query = makeSignupQuery(fakeData);

      const result = await request(app).post("/graphql").send(query);

      expect(result.body?.data?.signup?.accessToken).toBeTruthy();
      expect(result.body?.data?.signup?.name).toBe(fakeData.name);
    });

    // it("should return UNAUTHORIZED for invalid credentials", async () => {
    //   const fakeData = mockAccount();

    //   const query = makeSignupQuery(fakeData);

    //   const result = await request(app).post("/graphql").send(query);
    //   console.log("🚀 ~ result", result.body)

    //   expect(result.body?.data).toBeFalsy();
    //   expect(result.body?.errors[0].extensions.code).toBe("UNAUTHORIZED");
    // });
  });
});
