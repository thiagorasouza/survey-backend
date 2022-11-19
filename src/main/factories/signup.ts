import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const encrypter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  );
  return signUpController;
};
