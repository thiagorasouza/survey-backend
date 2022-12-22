import { SurveyCompiledModel } from "../../../../domain/models/survey-result";
import { LoadSurveyResult } from "../../../../domain/usecases/survey-result/load-survey-result";
import { LoadBySurveyIdRepository } from "../../../protocols/db/survey-result/load-by-survey-id-repository";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadBySurveyIdRepository: LoadBySurveyIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyCompiledModel> {
    await this.loadBySurveyIdRepository.loadBySurveyId(surveyId);
    return;
  }
}
