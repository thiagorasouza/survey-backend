import {
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository,
  AccountModel,
} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
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
