import { SurveyResultModel } from "../../../../domain/models/survey-result";

export interface LoadByAccountIdRepository {
  loadByAccountId(accountId: string): Promise<SurveyResultModel[]>;
}
