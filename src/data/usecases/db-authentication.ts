import {
  Authentication,
  AuthenticationRequestModel,
  AuthenticationResponseModel,
} from "../../domain/usecases";
import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "../protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(
    authData: AuthenticationRequestModel
  ): Promise<AuthenticationResponseModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authData.email
    );
    if (!account) {
      return null;
    }

    const isValid = await this.hashComparer.compare(
      authData.password,
      account.password
    );
    if (!isValid) {
      return null;
    }

    const accessToken = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    );

    return { accessToken, name: account.name };
  }
}
