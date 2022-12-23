import { SurveyResultModel } from "../../domain/models/survey-result";
import {
  mockSurveyResultModel,
  mockSurveyResultModelList,
} from "../../domain/test";
import { SaveSurveyResultParams } from "../../domain/usecases/survey-result/save-survey-result";
import { LoadSurveyResultRepository } from "../protocols/db/survey-result/load-survey-result-repository";
import { SaveSurveyResultRepository } from "../protocols/db/survey-result/save-survey-result-repository";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return mockSurveyResultModel();
      }
      async loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]> {
        return mockSurveyResultModelList();
      }
    }

    return new SaveSurveyResultRepositoryStub();
  };

export const mockLoadSurveyRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyRepository implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel[]> {
      return mockSurveyResultModelList();
    }
  }

  return new LoadSurveyRepository();
};
