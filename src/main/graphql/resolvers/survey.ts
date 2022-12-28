import { adaptResolver } from "../../adapters/apollo-resolver-adapter";
import { makeLoadSurveysController } from "../../factories/controllers";
import { throwIfNotAuthenticated } from "../helpers/throw-if-not-authenticated";

export default {
  Query: {
    surveys: async (
      parent: any,
      args: any,
      contextValue: any
    ): Promise<void> => {
      throwIfNotAuthenticated(contextValue);
      return adaptResolver(makeLoadSurveysController());
    },
  },
};
