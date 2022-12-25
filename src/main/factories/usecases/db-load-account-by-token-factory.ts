import { DbLoadAccountByToken } from "../../../data/usecases/db-load-account-by-token";
import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository";
import env from "../../config/env";

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret);
  const repository = new AccountMongoRepository();
  return new DbLoadAccountByToken(decrypter, repository);
};
