import request from "supertest";
import { Collection } from "mongodb";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helper";
import { Express } from "express";
import env from "../../../src/main/config/env";
import { setupServer } from "../../../src/main/config/server";
import { makeAccessToken } from "../mocks/access-token";
import { makeSurvey } from "../mocks/survey";
import MockDate from "mockdate";

describe("SurveyResult GraphQL APIs", () => {
  let app: Express;
  let accounts: Collection;
  let surveys: Collection;

  const makeSurveyResultQuery = (surveyId: string) => ({
    query: `#graphql
            query ($surveyId: String!) {
              surveyResult(surveyId: $surveyId) {
                surveyId
                question                
                answers {
                  image
                  answer
                  count
                  percent
                  isCurrentAccountAnswer
                }
                date
              }
            }`,
    variables: { surveyId },
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

  describe("surveyResult() query", () => {
    it("should return compiled survey result", async () => {
      const surveyId = await makeSurvey();
      const accessToken = await makeAccessToken();

      const query = makeSurveyResultQuery(surveyId);
      const result = await request(app)
        .post("/graphql")
        .set("X-Access-Token", accessToken)
        .send(query);

      expect(result.body?.data?.surveyResult?.surveyId).toBe(surveyId);
      expect(result.body?.data?.surveyResult?.question).toBe("Any Question");
      expect(result.body?.data?.surveyResult?.answers).toEqual([
        {
          image: "http://image-name.com",
          answer: "Answer 1",
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
        {
          image: null,
          answer: "Answer 2",
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        },
      ]);
      expect(result.body?.data?.surveyResult?.date).toBe(
        new Date().toISOString()
      );
    });
  });
});
