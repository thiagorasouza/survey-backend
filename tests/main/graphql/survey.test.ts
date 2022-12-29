import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { Express } from "express";
import env from "../../../src/main/config/env";
import { setupServer } from "../../../src/main/config/server";
import { makeAccessToken } from "../mocks/access-token";
import { makeSurvey } from "../mocks/survey";
import MockDate from "mockdate";

describe("Survey GraphQL APIs", () => {
  let app: Express;
  let accounts: Collection;
  let surveys: Collection;

  const makeSurveysQuery = () => ({
    query: `#graphql
            query {
              surveys {
                id
                question
                answers {
                  image
                  answer
                }
                date
                didAnswer
              }
            }`,
  });

  beforeEach(async () => {
    surveys = await MongoHelper.getCollection("surveys");
    await surveys.deleteMany({});
    accounts = await MongoHelper.getCollection("accounts");
    await accounts.deleteMany({});
  });

  beforeAll(async () => {
    MockDate.set(new Date());
    await MongoHelper.connect(env.mongoUrl);
    ({ app } = await setupServer());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  describe("surveys() query", () => {
    it("should return created surveys", async () => {
      await makeSurvey();
      const accessToken = await makeAccessToken();

      const query = makeSurveysQuery();
      const result = await request(app)
        .post("/graphql")
        .set("X-Access-Token", accessToken)
        .send(query);

      expect(result.body?.data.surveys?.length).toBe(1);
      expect(result.body?.data.surveys[0]?.id).toBeTruthy();
      expect(result.body?.data.surveys[0]?.question).toBe("Any Question");
      expect(result.body?.data.surveys[0]?.answers).toEqual([
        {
          image: "http://image-name.com",
          answer: "Answer 1",
        },
        {
          image: null,
          answer: "Answer 2",
        },
      ]);
      expect(result.body?.data.surveys[0]?.date).toBe(new Date().toISOString());
      expect(result.body?.data.surveys[0]?.didAnswer).toBe(false);
    });
  });
});
