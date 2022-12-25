import { LogMongoRespository } from "../../../infra/db/mongodb/log-mongo-repository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log-controller-decorator";

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logErrorRepository = new LogMongoRespository();
  return new LogControllerDecorator(controller, logErrorRepository);
};
