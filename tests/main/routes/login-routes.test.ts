import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { setupServer } from "../../../src/main/config/server";
import env from "../../../src/main/config/env";
import * as bcrypt from "bcrypt";

describe("Login Routes", () => {
  let app;
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

  describe("POST /signup", () => {
    it("should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "valid_name",
          email: "valid_email@email.com",
          password: "valid_password",
          passwordConfirmation: "valid_password",
        })
        .expect(200);
    });
  });

  describe("POST /login", () => {
    it("should return 200 on login", async () => {
      const password = await bcrypt.hash("valid_password", 12);
      await accounts.insertOne({
        name: "valid_name",
        email: "valid_email@email.com",
        password,
      });
      await request(app)
        .post("/api/login")
        .send({
          email: "valid_email@email.com",
          password: "valid_password",
        })
        .expect(200);
    });

    it("should return 401 on login if credentials are invalid", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "inexistent_email@email.com",
          password: "inexistent_password",
        })
        .expect(401);
    });
  });
});
