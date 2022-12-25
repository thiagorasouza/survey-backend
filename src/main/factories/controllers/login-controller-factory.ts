import { LoginController } from "../../../presentation/controllers/login-controller";
import { Controller } from "../../../presentation/protocols";
import { makeLogControllerDecorator } from "../decorators";
import { makeDbAuthentication } from "../usecases";
import { makeLoginValidation } from "./login-validation-factory";

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  );
  return makeLogControllerDecorator(loginController);
};
