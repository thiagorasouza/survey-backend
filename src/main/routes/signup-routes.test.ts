import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe("SignUp Routes", () => {
  beforeEach(async () => {
    const accounts = await MongoHelper.getCollection("accounts");
    await accounts.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("should return an account on success", async () => {
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
