import {
  AddAccount,
  AddAccountRequestModel,
  AddAccountResponseModel,
} from "../../domain/usecases";
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from "../protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(
    accountData: AddAccountRequestModel
  ): Promise<AddAccountResponseModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    );
    if (account) {
      return false;
    }

    const hashedPassword = await this.hasher.hash(accountData.password);

    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return true;
  }
}
