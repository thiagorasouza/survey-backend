import { SurveyModel } from "../../domain/models/survey";
import { SurveyResultModel } from "../../domain/models/survey-result";
import {
  mockSurveyModel,
  mockSurveyModelList,
  mockSurveyResultModelList,
} from "../../domain/test";
import { LoadByAccountIdRepository } from "../protocols/db/survey-result/load-by-account-id-repository";
import { AddSurveyRepository } from "../protocols/db/survey/add-survey-repository";
import { LoadSurveyByIdRepository } from "../protocols/db/survey/load-survey-by-id-repository";
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository";

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
    async loadByAccountId(accountId: string): Promise<SurveyResultModel[]> {
      return mockSurveyResultModelList();
    }
  }

  return new LoadByAccountIdRepositoryStub();
};
