import { SurveyResultModel } from "../../domain/models/survey-result";
import {
  mockSurveyResultModel,
  mockSurveyResultModelList,
} from "../../domain/test";
import { SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result";
import { LoadBySurveyIdRepository } from "../protocols/db/survey-result/load-by-survey-id-repository";
import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return mockSurveyResultModel();
      }
    }

    return new SaveSurveyResultRepositoryStub();
  };

export const mockLoadBySurveyIdRepository = (): LoadBySurveyIdRepository => {
  class LoadBySurveyIdRepositoryStub implements LoadBySurveyIdRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]> {
      return mockSurveyResultModelList();
    }
  }

  return new LoadBySurveyIdRepositoryStub();
};
