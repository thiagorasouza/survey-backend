import { LoadByAccountIdRepository } from "../../../protocols/db/survey-result/load-by-account-id-repository";
import {
  LoadSurveys,
  SurveyModel,
  LoadSurveysRepository,
} from "./db-load-surveys-protocols";

export class DbLoadSurveys implements LoadSurveys {
  constructor(
    private readonly loadSurveysRepository: LoadSurveysRepository,
    private readonly loadByAccountIdRepository: LoadByAccountIdRepository
  ) {}

  async load(accountId: string): Promise<SurveyModel[]> {
    await this.loadByAccountIdRepository.loadByAccountId(accountId);
    return await this.loadSurveysRepository.loadAll();
  }
}
