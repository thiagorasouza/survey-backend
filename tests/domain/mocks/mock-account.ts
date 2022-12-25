import { AccountModel, AuthenticationModel } from "../../../src/domain/models";
import {
  AddAccountRequestModel,
  AuthenticationParams,
  AddAccount,
  Authentication,
  LoadAccountByToken,
  AddAccountResponseModel,
} from "../../../src/domain/usecases";

export const mockAccountModel = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: "any_token",
  name: "any_name",
});

export const mockAddAccountParams = (): AddAccountRequestModel => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: "any_email@mail.com",
  password: "any_password",
});

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async add(): Promise<AddAccountResponseModel> {
      return true;
    }
  }

  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<AuthenticationModel> {
      return mockAuthenticationModel();
    }
  }

  return new AuthenticationStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenStub();
};
