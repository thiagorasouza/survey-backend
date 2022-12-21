import { mockAccountModel } from "../../domain/test";
import { LoadAccountByTokenRepository } from "../protocols/db/account/load-account-by-token-repository";
import { UpdateAccessTokenRepository } from "../protocols/db/account/update-access-token-repository";
import {
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from "../usecases/account/add-account/db-add-account-protocols";

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async loadByEmail(): Promise<AccountModel | null> {
        return mockAccountModel();
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(): Promise<AccountModel> {
        return mockAccountModel();
      }
    }

    return new LoadAccountByTokenRepositoryStub();
  };

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(): Promise<void> {
        return;
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };
