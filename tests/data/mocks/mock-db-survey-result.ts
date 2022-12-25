import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
} from "../../../src/data/protocols";
import { SurveyResultModel } from "../../../src/domain/models";
import { LoadSurveyResultRequestModel } from "../../../src/domain/usecases";
import {
  mockSurveyResultModel,
  mockSurveyResultModelList,
} from "../../domain/mocks";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(): Promise<SurveyResultModel> {
        return mockSurveyResultModel();
      }
      async loadBySurveyId(): Promise<SurveyResultModel[]> {
        return mockSurveyResultModelList();
      }
    }

    return new SaveSurveyResultRepositoryStub();
  };

export const mockLoadSurveyRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyRepository implements LoadSurveyResultRepository {
    async loadBySurveyId(): Promise<SurveyResultModel[]> {
      return mockSurveyResultModelList();
    }
  }

  return new LoadSurveyRepository();
};

export const mockLoadSurveyResultRequestModel =
  (): LoadSurveyResultRequestModel => ({
    surveyId: "any_survey_id",
    accountId: "any_account_id",
  });
