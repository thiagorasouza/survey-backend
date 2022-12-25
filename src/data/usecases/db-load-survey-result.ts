import { SurveyCompiledModel } from "../../domain/models";
import { LoadSurveyResult } from "../../domain/usecases";
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository,
} from "../protocols";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(
    surveyId: string,
    accountId: string
  ): Promise<SurveyCompiledModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(surveyId);
    const surveyResults = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId
    );

    const accountAnswer = surveyResults.find(
      (surveyResult) => surveyResult.accountId === accountId
    )?.answer;

    const total = surveyResults.length;

    const answers = survey.answers.map((answer) => {
      const count = surveyResults.filter(
        (surveyResult) => surveyResult.answer === answer.answer
      ).length;
      const percent = total > 0 ? (count / total) * 100 : 0;
      const isCurrentAccountAnswer = answer.answer === accountAnswer;

      return {
        ...answer,
        count,
        percent,
        isCurrentAccountAnswer,
      };
    });

    return {
      surveyId: survey.id,
      question: survey.question,
      answers,
      date: survey.date,
    };
  }
}
