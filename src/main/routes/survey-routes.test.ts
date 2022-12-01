import { Collection } from "mongodb";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import env from "../config/env";
import request from "supertest";
import app from "../config/app";

describe("Survey Routes", () => {
  let surveys: Collection;

  beforeEach(async () => {
    surveys = await MongoHelper.getCollection("surveys");
    await surveys.deleteMany({});
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
  });
});
