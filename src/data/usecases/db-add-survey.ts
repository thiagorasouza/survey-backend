import {
  AddSurvey,
  AddSurveyRequestModel,
  AddSurveyResponseModel,
} from "../../domain/usecases";
import { AddSurveyRepository } from "../protocols";

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(
    surveyData: AddSurveyRequestModel
  ): Promise<AddSurveyResponseModel> {
    await this.addSurveyRepository.add(surveyData);
  }
}
