import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";
import * as bcrypt from "bcrypt";

describe("Login Routes", () => {
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
  });
});
