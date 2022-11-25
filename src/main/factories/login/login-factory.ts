// import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
// import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
// import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
// import { LogMongoRespository } from "../../../infra/db/mongodb/log/log-mongo-repository";
// import { SignUpController } from "../../../presentation/controllers/signup/signup-controller";
// import { Controller } from "../../../presentation/protocols";
// import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
// import { makeSignUpValidation } from "./signup-validation-factory";

import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { LogMongoRespository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
import { makeLoginValidation } from "./login-validation-factory";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const hashComparer = new BcryptAdapter(salt);
  const encrypter = new JwtAdapter(env.jwtSecret);
  const authentication = new DbAuthentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  );
  const loginValidation = makeLoginValidation();
  const loginController = new LoginController(authentication, loginValidation);
  const logErrorRepository = new LogMongoRespository();
  return new LogControllerDecorator(loginController, logErrorRepository);

  // const salt = 12;
  // const hasher = new BcryptAdapter(salt);
  // const addAccountRepository = new AccountMongoRepository();
  // const dbAddAccount = new DbAddAccount(hasher, addAccountRepository);
  // const signUpController = new SignUpController(
  //   dbAddAccount,
  //   makeSignUpValidation()
  // );
  // const logMongoRepository = new LogMongoRespository();
  // return new LogControllerDecorator(signUpController, logMongoRepository);
};
