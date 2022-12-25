import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
} from "../../../src/data/protocols";
import { SurveyResultModel } from "../../../src/domain/models";
import { SaveSurveyResultParams } from "../../../src/domain/usecases";
import {
  mockSurveyResultModel,
  mockSurveyResultModelList,
} from "../../domain/mocks";

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
