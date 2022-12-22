import { SurveyResultModel } from "../../../../domain/models/survey-result";
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "../../../../domain/usecases/survey-result/save-survey-result";
import { LoadBySurveyIdRepository } from "../../../protocols/db/survey-result/load-by-survey-id-repository";
import { SaveSurveyResultRepository } from "../../../protocols/db/survey-result/save-survey-result-repository";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadBySurveyIdRepository: LoadBySurveyIdRepository
  ) {}

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.loadBySurveyIdRepository.loadBySurveyId(data.surveyId);
    return await this.saveSurveyResultRepository.save(data);
  }
}
