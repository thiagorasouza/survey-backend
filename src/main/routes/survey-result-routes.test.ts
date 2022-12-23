import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import env from "../config/env";
import request from "supertest";
import app from "../config/app";
import { Collection } from "mongodb";
import { sign } from "jsonwebtoken";

describe("Survey Routes", () => {
  let surveys: Collection;
  let accounts: Collection;

  const makeAccessToken = async (): Promise<string> => {
    const response = await accounts.insertOne({
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
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

  describe("PUT /surveys/:surveyId/results", () => {
    it("should return 403 on save survey result with invalid access token", async () => {
      await request(app)
        .put("/api/surveys/any_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(403);
    });

    it("should return 200 on save survey result with valid access token", async () => {
      const result = await surveys.insertOne({
        question: "Any Question",
        answers: [
          {
            image: "http://image-name.com",
            answer: "Answer 1",
          },
          { answer: "Answer 2" },
        ],
      });
      const { insertedId } = result;
      const surveyId = insertedId.toString();

      const accessToken = await makeAccessToken();

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set("X-Access-Token", accessToken)
        .send({
          answer: "Answer 1",
        })
        .expect(200);
    });
  });

  describe("GET /surveys/:surveyId/results", () => {
    it("should return 403 on load survey result with invalid access token", async () => {
      await request(app)
        .get("/api/surveys/any_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(403);
    });
  });
});
