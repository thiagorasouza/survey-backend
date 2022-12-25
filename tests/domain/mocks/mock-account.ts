import { AccountModel, AuthenticationModel } from "../../../src/domain/models";
import {
  AddAccountRequestModel,
  AuthenticationRequestModel,
  AddAccount,
  Authentication,
  LoadAccountByToken,
  AddAccountResponseModel,
  AuthenticationResponseModel,
  LoadAccountByTokenResponseModel,
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

export const mockAddAccountRequestModel = (): AddAccountRequestModel => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

export const mockAuthenticationRequestModel =
  (): AuthenticationRequestModel => ({
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
    async auth(): Promise<AuthenticationResponseModel> {
      return mockAuthenticationModel();
    }
  }

  return new AuthenticationStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(): Promise<LoadAccountByTokenResponseModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenStub();
};
