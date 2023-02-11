import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import env from "../../../src/main/config/env";
import { setupServer } from "../../../src/main/config/server";
import { makeAccessToken } from "../mocks/access-token";
import { makeSurvey } from "../mocks/survey";

describe("Survey Routes", () => {
  let app;
  let surveys: Collection;
  let accounts: Collection;

  beforeEach(async () => {
    surveys = await MongoHelper.getCollection("surveys");
    await surveys.deleteMany({});
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

  describe("PUT /surveys/:surveyId/results", () => {
    it("should return 401 on save survey result with invalid access token", async () => {
      await request(app)
        .put("/api/surveys/any_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(401);
    });

    it("should return 200 on save survey result with valid access token", async () => {
      const surveyId = await makeSurvey();
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
    it("should return 401 on load survey result with invalid access token", async () => {
      await request(app)
        .get("/api/surveys/any_id/results")
        .send({
          answer: "any_answer",
        })
        .expect(401);
    });

    it("should return 200 on load survey result with valid access token", async () => {
      const surveyId = await makeSurvey();
      const accessToken = await makeAccessToken();

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set("X-Access-Token", accessToken)
        .expect(200);
    });
  });
});
