import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/account";
import { LogMongoRespository } from "../../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../../presentation/controllers/signup/signup";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(hasher, addAccountRepository);
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  );
  const logMongoRepository = new LogMongoRespository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
