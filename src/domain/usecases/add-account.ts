import { AccountModel } from "../models/account";

export type AddAccountRequestModel = Omit<AccountModel, "id">;

export type AddAccountResponseModel = boolean;

export interface AddAccount {
  add(account: AddAccountRequestModel): Promise<AddAccountResponseModel>;
}
