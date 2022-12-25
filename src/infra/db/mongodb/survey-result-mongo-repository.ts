import { ObjectId } from "mongodb";
import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
  LoadByAccountIdRepository,
} from "../../../data/protocols";
import { SurveyResultModel } from "../../../domain/models";
import { SaveSurveyResultRequestModel } from "../../../domain/usecases";
import { MongoHelper } from "./mongo-helper";

export class SurveyResultMongoRepository
  implements
    SaveSurveyResultRepository,
    LoadSurveyResultRepository,
    LoadByAccountIdRepository
{
  async save(data: SaveSurveyResultRequestModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const response = await surveyResultsCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
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

  async loadByAccountId(accountId: string): Promise<SurveyResultModel[]> {
    const surveyResultsCollection = await MongoHelper.getCollection(
      "surveyResults"
    );
    const response = await surveyResultsCollection
      .find({ accountId: new ObjectId(accountId) })
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
