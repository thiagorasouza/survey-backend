import { DbAddAccount } from "../../../data/usecases/db-add-account";
import { AddAccount } from "../../../domain/usecases/add-account";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository";

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const repository = new AccountMongoRepository();
  return new DbAddAccount(hasher, repository, repository);
};
