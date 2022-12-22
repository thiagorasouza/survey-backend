import { SurveyCompiledModel } from "../../models/survey-result";

export interface LoadSurveyResult {
  load(surveyId: string): Promise<SurveyCompiledModel>;
}
