import { SurveyModel } from "../../models/survey";
import { SurveyCompiledModel } from "../../models/survey-result";

export type SaveSurveyResultParams = {
  survey: SurveyModel;
  accountId: string;
  answer: string;
  date: Date;
};

export interface SaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SurveyCompiledModel>;
}
