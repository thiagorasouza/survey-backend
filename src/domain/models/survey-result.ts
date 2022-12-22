export interface SurveyResultModel {
  id: string;
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
}

export interface SurveyCompiledModel {
  surveyId: string;
  question: string;
  answers: {
    image?: string;
    answer: string;
    count: number;
    percent: number;
  }[];
  date: Date;
}
