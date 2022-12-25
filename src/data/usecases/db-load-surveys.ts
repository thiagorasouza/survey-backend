import { SurveyModel } from "../../domain/models";
import { LoadSurveys } from "../../domain/usecases";
import { LoadByAccountIdRepository, LoadSurveysRepository } from "../protocols";

export class DbLoadSurveys implements LoadSurveys {
  constructor(
    private readonly loadSurveysRepository: LoadSurveysRepository,
    private readonly loadByAccountIdRepository: LoadByAccountIdRepository
  ) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    const surveyResults = await this.loadByAccountIdRepository.loadByAccountId(
      accountId
    );

    const surveysAnswered = surveyResults.map(
      (surveyResult) => surveyResult.surveyId
    );

    const surveys = await this.loadSurveysRepository.loadAll();

    const response = surveys.map((survey) => ({
      ...survey,
      didAnswer: surveysAnswered.includes(survey.id),
    }));

    return response;
  }
}
