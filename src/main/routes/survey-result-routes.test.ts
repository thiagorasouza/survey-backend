import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import env from "../config/env";
import request from "supertest";
import app from "../config/app";

describe("Survey Routes", () => {
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
  });
});
