import { AccountModel } from "../models/account";

export interface LoadAccountByTokenRequestModel {
  accessToken: string;
  role?: string;
}

export type LoadAccountByTokenResponseModel = AccountModel;

export interface LoadAccountByToken {
  load(
    requestModel: LoadAccountByTokenRequestModel
  ): Promise<LoadAccountByTokenResponseModel>;
}
