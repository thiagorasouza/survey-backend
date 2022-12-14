import { DbAuthentication } from "../../../data/usecases/db-authentication";
import { Authentication } from "../../../domain/usecases/authentication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository";
import env from "../../config/env";

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const hashComparer = new BcryptAdapter(salt);
  const encrypter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  );
};
