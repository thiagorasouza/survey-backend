import { MongoHelper } from "../../../src/infra/db/mongodb";

export const makeSurvey = async (): Promise<string> => {
  const surveys = await MongoHelper.getCollection("surveys");
  await surveys.deleteMany({});

  const result = await surveys.insertOne({
    question: "Any Question",
    answers: [
      {
        image: "http://image-name.com",
        answer: "Answer 1",
      },
      { answer: "Answer 2" },
    ],
    date: new Date(),
  });
  const { insertedId } = result;
  const surveyId = insertedId.toString();

  return surveyId;
};
