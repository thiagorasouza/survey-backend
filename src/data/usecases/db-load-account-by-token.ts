import {
  LoadAccountByToken,
  LoadAccountByTokenRequestModel,
  LoadAccountByTokenResponseModel,
} from "../../domain/usecases";
import { Decrypter, LoadAccountByTokenRepository } from "../protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(
    requestModel: LoadAccountByTokenRequestModel
  ): Promise<LoadAccountByTokenResponseModel> {
    const accessToken = requestModel.accessToken;
    const role = requestModel.role;

    let token;
    try {
      token = await this.decrypter.decrypt(accessToken);
      if (!token) {
        return null;
      }
    } catch (error) {
      return null;
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(
      accessToken,
      role
    );
    if (!account) {
      return null;
    }

    return account;
  }
}
