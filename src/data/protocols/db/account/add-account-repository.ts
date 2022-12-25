import { AccountModel } from "../../../../domain/models";
import { AddAccountRequestModel } from "../../../../domain/usecases";

export interface AddAccountRepository {
  add(account: AddAccountRequestModel): Promise<AccountModel>;
}
