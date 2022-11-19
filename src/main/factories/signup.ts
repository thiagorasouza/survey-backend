import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LogMongoRespository } from "../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorator/log";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );
  const logMongoRepository = new LogMongoRespository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
