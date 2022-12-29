import request from "supertest";
import { setupServer } from "../../../src/main/config/server";
import env from "../../../src/main/config/env";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { makeAccessToken } from "../mocks/access-token";

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
      const accessToken = await makeAccessToken("admin");

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

    it("should return 204 on load surveys with valid token", async () => {
      const accessToken = await makeAccessToken("admin");

      await request(app)
        .get("/api/surveys")
        .set("X-Access-Token", accessToken)
        .send()
        .expect(204);
    });
  });
});
