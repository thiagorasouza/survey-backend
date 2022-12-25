import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  LoadByAccountIdRepository,
} from "../../../src/data/protocols";
import { SurveyModel, SurveyResultModel } from "../../../src/domain/models";
import {
  LoadSurveyByIdRequestModel,
  LoadSurveysRequestModel,
} from "../../../src/domain/usecases";
import {
  mockSurveyModel,
  mockSurveyModelList,
  mockSurveyResultModelList,
} from "../../domain/mocks";

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add(): Promise<void> {
      return;
    }
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return mockSurveyModelList();
    }
  }

  return new LoadSurveysRepositoryStub();
};

export const mockLoadByAccountIdRepository = (): LoadByAccountIdRepository => {
  class LoadByAccountIdRepositoryStub implements LoadByAccountIdRepository {
    async loadByAccountId(): Promise<SurveyResultModel[]> {
      return mockSurveyResultModelList();
    }
  }

  return new LoadByAccountIdRepositoryStub();
};

export const mockLoadSurveyByIdRequestModel =
  (): LoadSurveyByIdRequestModel => ({
    id: "any_survey_id",
  });

export const mockLoadSurveysRequestModel = (): LoadSurveysRequestModel => ({
  accountId: "any_account_id",
});
