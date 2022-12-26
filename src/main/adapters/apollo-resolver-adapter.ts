import { Controller } from "../../presentation/protocols";

export const adaptResolver = async (controller: Controller, args: any) => {
  const httpResponse = await controller.handle(args);
  return httpResponse.body;
};
