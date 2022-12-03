import { DbLoadAccountByToken } from "../../../../../data/usecases/account/load-account-by-token/db-load-account-by-token";
import { LoadAccountByToken } from "../../../../../domain/usecases/account/load-account-by-token";
import { JwtAdapter } from "../../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account/account-mongo-repository";
import env from "../../../../config/env";

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret);
  const repository = new AccountMongoRepository();
  return new DbLoadAccountByToken(decrypter, repository);
};
