import { Collection } from "mongodb";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import env from "../config/env";
import request from "supertest";
import app from "../config/app";
import { sign } from "jsonwebtoken";

describe("Survey Routes", () => {
  let surveys: Collection;
  let accounts: Collection;

  const makeAccessToken = async (): Promise<string> => {
    const response = await accounts.insertOne({
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
      role: "admin",
    });
    const { insertedId } = response;
    const id = insertedId.toString();

    const accessToken = sign(id, env.jwtSecret);

    await accounts.updateOne(
      { _id: insertedId },
      {
        $set: {
          accessToken,
        },
      }
    );

    return accessToken;
  };

  beforeEach(async () => {
    surveys = await MongoHelper.getCollection("surveys");
    await surveys.deleteMany({});
    accounts = await MongoHelper.getCollection("accounts");
    await accounts.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe("POST /surveys", () => {
    it("should return 403 on add survey without access token", async () => {
      await request(app)
        .post("/api/surveys")
        .send({
          question: "Any Question",
          answers: [
            {
              image: "http://image-name.com",
              answer: "Answer 1",
            },
            { answer: "Answer 2" },
          ],
        })
        .expect(403);
    });

    it("should return 204 on add survey with valid token", async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .post("/api/surveys")
        .set("X-Access-Token", accessToken)
        .send({
          question: "Any Question",
          answers: [
            {
              image: "http://image-name.com",
              answer: "Answer 1",
            },
            { answer: "Answer 2" },
          ],
        })
        .expect(204);
    });
  });

  describe("GET /surveys", () => {
    it("should return 403 on load surveys without access token", async () => {
      await request(app).get("/api/surveys").send().expect(403);
    });

    it("should return 200 on load surveys with valid token", async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .get("/api/surveys")
        .set("X-Access-Token", accessToken)
        .send()
        .expect(204);
    });
  });
});
