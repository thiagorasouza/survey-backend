import { ObjectId } from "mongodb";
import { LoadBySurveyIdRepository } from "../../../../data/protocols/db/survey-result/load-by-survey-id-repository";
import { SaveSurveyResultRepository } from "../../../../data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "../../../../domain/models/survey-result";
import { SaveSurveyResultParams } from "../../../../domain/usecases/survey-result/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadBySurveyIdRepository
{
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const response = await surveyResultsCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.survey.id),
        accountId: new ObjectId(data.accountId),
      },
      { $set: { answer: data.answer, date: data.date } },
      { upsert: true, returnDocument: "after" }
    );
    return this.mapIds(response.value);
  }

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]> {
    const surveyResultsCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const response = await surveyResultsCollection
      .find({ surveyId: new ObjectId(surveyId) })
      .toArray();

    return response.map(this.mapIds);
  }

  private mapIds(data: any): any {
    const { _id, surveyId, accountId, ...rest } = data;
    return {
      id: _id.toString(),
      surveyId: surveyId.toString(),
      accountId: accountId.toString(),
      ...rest,
    };
  }
}
