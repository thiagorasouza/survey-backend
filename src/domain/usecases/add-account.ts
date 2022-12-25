export interface AddAccountRequestModel {
  name: string;
  email: string;
  password: string;
}

export type AddAccountResponseModel = boolean;

export interface AddAccount {
  add(account: AddAccountRequestModel): Promise<AddAccountResponseModel>;
}
