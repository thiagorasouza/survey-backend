import { ObjectId } from "mongodb";
import { LoadSurveysRepository } from "../../../../data/protocols/db/survey/load-surveys-repository";
import {
  AddSurveyModel,
  AddSurveyRepository,
} from "../../../../data/usecases/add-survey/db-add-survey-protocols";
import { LoadSurveyByIdRepository } from "../../../../data/usecases/load-survey-by-id/db-load-survey-by-id-protocols";
import { SurveyModel } from "../../../../domain/models/survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveys = await MongoHelper.getCollection("surveys");
    const result = await surveys.find().toArray();
    const mapped = result.map(this.mapId);
    return mapped;
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveys = await MongoHelper.getCollection("surveys");
    const objId = new ObjectId(id);
    const result = await surveys.findOne({ _id: objId });
    const mapped = this.mapId(result);
    return mapped;
  }

  private mapId(survey: any): any {
    const { _id, ...rest } = survey;
    return { id: _id.toString(), ...rest };
  }
}
