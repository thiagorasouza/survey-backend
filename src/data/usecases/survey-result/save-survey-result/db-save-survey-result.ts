import {
  SurveyCompiledModel,
  SurveyResultModel,
} from "../../../../domain/models/survey-result";
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

  async save(data: SaveSurveyResultParams): Promise<SurveyCompiledModel> {
    await this.saveSurveyResultRepository.save(data);

    const surveyResults = await this.loadBySurveyIdRepository.loadBySurveyId(
      data.survey.id
    );

    const total = surveyResults.length;
    const answers = data.survey.answers.map((answer) => {
      const count = surveyResults.filter(
        (surveyResult) => surveyResult.answer === answer.answer
      ).length;
      const percent = total > 0 ? (count / total) * 100 : 100;
      return {
        ...answer,
        count,
        percent,
      };
    });

    return {
      surveyId: data.survey.id,
      question: data.survey.question,
      answers,
      date: data.survey.date,
    };
  }
}
